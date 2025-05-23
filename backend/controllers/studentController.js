import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import Student from "../models/Student.js";

// Register a student
const registerStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Enter required fields");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const studentExists = await Student.findOne({ email });
  if (studentExists) {
    res.status(501);
    throw new Error("Student already exists");
  } else
    try {
      const student = await Student.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      if (student) {
        generateToken(res, student._id, "student");
        res.status(200).json({
          message: "Student Registered Successfully",
          data: {
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
          },
        });
      } else {
        res.status(400);
        throw new Error("Student registration failed");
      }
    } catch (error) {
      res.status(500).json({ message: "Error Occured!", error });
    }
});

// Login student
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Enter required fields");
  }
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (isMatch) {
      generateToken(res, student._id, "student");
      res.status(200).json({
        message: "Student Logged in Successfully",
        data: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        },
      });
    } else {
      res.status(404);
      throw new Error("Invalid Password");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// Logout student
const logoutStudent = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expiresIn: new Date(0) });
  res.json({ message: "Logout successfull" });
});

// Get individual student data
const getStudentDetails = asyncHandler(async (req, res) => {
  const id = req.studentId;

  try {
    const student = await Student.findById(id).select("-password");
    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }
    res.status(200).json(student);
  } catch (error) {
    throw new Error(error.message);
  }
});

// Upload student photo
const uploadStudentPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No Photo Uploaded");
  }
  const student = await Student.findById(req.studentId);

  if (student?.studentPhoto) {
    fs.unlinkSync(`./uploads/${student.studentPhoto}`);
  }

  student.studentPhoto = req.file.filename;
  await student.save();
  res.status(200).json({ message: "Student Photo Uploaded" });

  try {
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

// Update student data
const updateStudent = asyncHandler(async (req, res) => {
  const id = req.studentId;
  const { dateOfBirth, address, mobile, phone, institutionDetails } = req.body;

  if ((!dateOfBirth || !address, !mobile, !phone, !institutionDetails)) {
    res.status(500);
    throw new Error("Fill out every field");
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedStudent)
      res
        .status(200)
        .json({ message: "Student data updated", data: updatedStudent });
    else {
      res.status(400);
      throw new Error("Student data update failed");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const isStudentProfileComplete = (student) => {
  if (
    !student.firstName ||
    !student.lastName ||
    !student.password ||
    !student.email ||
    !student.studentPhoto ||
    !student.dateOfBirth ||
    !student.address?.houseName ||
    !student.address?.houseStreet ||
    !student.address?.houseCity ||
    !student.address?.housePincode ||
    !student.mobile ||
    !student.institutionDetails?.institutionName ||
    !student.institutionDetails?.institutionStreet ||
    !student.institutionDetails?.institutionCity ||
    !student.institutionDetails?.institutionPincode ||
    !student.institutionDetails?.institutionPhone ||
    !student.institutionDetails.course?.courseName ||
    !student.institutionDetails.course?.currentYear ||
    !student.institutionDetails.course?.courseDuration
  ) {
    return false;
  } else {
    return true;
  }
};

const uploadIdCard = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  try {
    const student = await Student.findById(req.studentId);
    if (student.eligibility.status !== "false") {
      res.status(400);
      throw new Error("Already applied for verification");
    }

    // delete existing id card and upload new one
    if (student.studentIdCard)
      fs.unlinkSync(`./uploads/${student.studentIdCard}`);

    //upload an id card
    student.studentIdCard = req.file.filename;
    await student.save();
    res.status(200).json({ message: "ID Card uploaded!" });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const applyForVerification = asyncHandler(async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);

    // check if profile is complete
    if (!isStudentProfileComplete(student)) {
      res.status(400);
      throw new Error("Please fill every field in your Student Profile");
    }

    if (!student.studentIdCard) {
      res.status(400);
      throw new Error("Please upload your ID Card");
    }

    // apply for verification
    if (student?.eligibility?.status === "false") {
      try {
        student.eligibility.status = "pending";
        await student.save();

        res
          .status(200)
          .json({ message: "Student ID Card sent for verification!" });
      } catch (error) {
        student.eligibility.status = "false";
        await student.save();
        res.status(400);
        throw new Error(error.message);
      }
    } else {
      res.status(400);
      throw new Error("Already applied for verification");
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

// check verification status
const checkVerificationStatus = asyncHandler(async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);

    res.status(200).json({
      studentId: student._id,
      status: student?.eligibility?.status,
    });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

//Handle student application for concession card
const applyForCard = asyncHandler(async (req, res) => {
  const id = req.studentId;
  const routes = req.body;

  //checking elibibility
  const student = await Student.findById(id);

  if (student.eligibility.status !== "approved") {
    res.status(400);
    throw new Error(
      student.eligibility.status === "pending"
        ? "Student verification is still pending. Please wait."
        : "Student not verified. Please confirm identity."
    );
  }

  // check if already applied
  if (student.application.status === "false") {
    //check if routes is empty
    if (!routes[0]) {
      res.status(400);
      throw new Error("Enter atleast one route");
    }

    //check if first route contain desired places
    if (routes[0].startingPoint && routes[0].destination) {
    } else {
      res.status(400);
      throw new Error("Enter required places");
    }

    if (routes.length <= 4) {
      try {
        const resp = await Student.findByIdAndUpdate(
          id,
          { routes: routes, "application.status": "pending" },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({
          message: "Applied Successfully. Please check in a while for update",
          data: resp,
        });
      } catch (err) {
        res.status(400);
        throw new Error("Route(s) failed to add");
      }
    } else {
      res.status(400);
      throw new Error("Routes limit exceed");
    }
  } else {
    res.status(400);
    throw new Error("Already applied for concession card");
  }
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentDetails,
  isStudentProfileComplete,
  updateStudent,
  uploadStudentPhoto,
  uploadIdCard,
  applyForVerification,
  checkVerificationStatus,
  applyForCard,
};
