import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import admin from "../config/firebase.js";
import { generateConcessionCard } from "../utils/utils.js";
import uploadPDF from "../middleware/uploadPDF.js";

const authAdmin = asyncHandler(async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    res.status(400);
    throw new Error("Firebase token is required!");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneNumber = decodedToken.phone_number;

    const adminUser = await Admin.findOne({ phoneNumber });

    if (!adminUser) {
      res.status(400);
      throw new Error("Only registered admins can login!");
    }

    const token = generateToken(res, adminUser.id, "admin");

    res.status(200).json({ message: "Login Success", token });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//Get all students
const getAllStudents = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find().select(
      "firstName lastName email institutionDetails.institutionName application.status mobile"
    );
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get student by ID
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400);
      throw new Error("No Student ID found passing");
    }

    const student = await Student.findById(id).select("-password");

    if (!student) {
      res.status(400);
      throw new Error("No student found");
    }

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getStudentsAppliedForEligibility = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find(
      {
        "eligibility.status": "pending",
        "application.status": "false",
      },
      "firstName lastName dateOfBirth email mobile address institutionDetails studentIdCard eligibility"
    );
    res.status(200).json({ data: students });
  } catch (err) {
    res.status(400);
    throw new Error("Error fetching students for eligibility");
  }
});

const getStudentsAppliedForApplication = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find({
      "application.status": "pending",
      "eligibility.status": "approved",
    }).select("-password");
    res.status(200).json({ data: students });
  } catch (err) {
    res.status(400);
    throw new Error("Error fetching students for eligibility");
  }
});

const verifyStudentId = asyncHandler(async (req, res) => {
  const { studentId, decision, reason } = req.body;

  try {
    if (!studentId) {
      res.status(400);
      throw new Error("Please provide the studentId");
    }

    const student = await Student.findByIdAndUpdate(studentId);

    if (!student) {
      res.status(404);
      throw new Error("No student found");
    }

    if (student.eligibility.status === "false") {
      res.status(400);
      throw new Error("Student not applied for verification");
    }

    if (["approved", "rejected"].includes(student.eligibility.status)) {
      res.status(400);
      throw new Error("Student already verified by admins");
    }

    if (!decision) {
      res.status(400);
      throw new Error("Please select an option");
    }

    // If there is a decision, there should be a reason
    if (decision === "rejected" && !reason) {
      res.status(400);
      throw new Error("Please provide a reason for rejection");
    }

    await Student.findByIdAndUpdate(
      studentId,
      { "eligibility.status": decision, "eligibility.reason": reason },
      { new: true }
    );

    res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const approveStudentConcessionCard = asyncHandler(async (req, res) => {
  const { studentId, decision, reason } = req.body;

  try {
    if (!studentId) {
      res.status(400);
      throw new Error("Please provide the studentId");
    }

    const student = await Student.findByIdAndUpdate(studentId);

    if (!student) {
      res.status(404);
      throw new Error("No student found");
    }

    if (student.application.status === "false") {
      res.status(400);
      throw new Error("Student not applied for application");
    }

    if (student.application.status === "withdrawn") {
      res.status(400);
      throw new Error("Student application withdrawn");
    }

    if (["approved", "rejected"].includes(student.application.status)) {
      res.status(400);
      throw new Error("Concession card approved by admins");
    }

    if (!decision) {
      res.status(400);
      throw new Error("Please select an option");
    }

    // If there is a decision, there should be a reason
    if (decision === "rejected" && !reason) {
      res.status(400);
      throw new Error("Please provide a reason for rejection");
    }

    student.issuedDate = new Date();
    student.expiryDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );

    const concessionCard = await generateConcessionCard(student, res);

    const concessionCardUrl = await uploadPDF(concessionCard);

    await Student.findByIdAndUpdate(
      studentId,
      {
        concessionCardUrl,
        "application.status": decision,
        "application.reason": reason,
        issuedDate: student.issuedDate,
        expiryDate: student.expiryDate,
      },
      { new: true }
    );

    res.status(200).json({ message: "Application verified" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const verifyQR = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400);
      throw new Error("Student ID is missing");
    }

    const student = await Student.findById(id).select("-password");

    if (!student) {
      res.status(400);
      throw new Error("No Student found");
    }

    const isExpired = new Date(student.expiryDate) < new Date();

    res.status(200).json({ isExpired: isExpired, studentData: student });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// logout admin
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expiresIn: new Date(0) });
  res.json({ message: "Logout successfull" });
});

export {
  authAdmin,
  getAllStudents,
  getStudentById,
  getStudentsAppliedForEligibility,
  getStudentsAppliedForApplication,
  verifyStudentId,
  approveStudentConcessionCard,
  verifyQR,
  logoutAdmin,
};
