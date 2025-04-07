import asyncHandler from "express-async-handler";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import admin from "../config/firebase.js";
import QRCode from "qrcode";

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

const getStudentsAppliedForEligibility = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find(
      {
        "eligibility.status": "pending",
        "application.status": "false",
      },
      "firstName lastName dateOfBirth email address institutionDetails studentIdCard"
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

    await Student.findByIdAndUpdate(
      studentId,
      {
        concessionCard,
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

export {
  authAdmin,
  getStudentsAppliedForEligibility,
  getStudentsAppliedForApplication,
  verifyStudentId,
  approveStudentConcessionCard,
  verifyQR,
};

// Format the neccessary fields for concession card
const formatData = (data) => {
  const formatedData = {
    name: data.firstName + " " + data.lastName,
    age: data.age,
    dateOfBirth: data.dateOfBirth.toLocaleDateString(),
    institutionDetails: data.institutionDetails,
    routes: data.routes,
    qrCode: data.qrCode,
    issuedDate: data.issuedDate.toLocaleDateString(),
    expiryDate: data.expiryDate.toLocaleDateString(),
  };

  return formatedData;
};

// function to dynamically change placeholders in template file
const populateTemplate = (templatePath, data) => {
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual data
  const resolveValue = (path, obj) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);

  template = template.replace(/{{([\w.]+)}}/g, (_, key) => {
    return resolveValue(key, data) || "";
  });

  return template;
};

const generateConcessionCard = async (studentData, res) => {
  try {
    //QR generation
    const encodedURL = `http:localhost:5000/verify?id=${studentData.id}`;

    const qrImageData = await QRCode.toDataURL(encodedURL);
    studentData.qrCode = qrImageData;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve("./templates/concession-template.html");

    const htmlContent = populateTemplate(templatePath, formatData(studentData));

    await page.setContent(htmlContent);

    // Create the card pdf
    const outputFileName = `concession_card_${studentData._id}.pdf`;
    await page.pdf({
      path: outputFileName,
      width: "600px",
      height: "800px",
      printBackground: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
    });

    await browser.close();

    return outputFileName;
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
};
