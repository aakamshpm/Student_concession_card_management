import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import Student from "../models/Student.js";

// Register a student
const registerStudent = asyncHandler(async (req, res) => {
  const {
    name,
    institutionDetails: { institutionName },
    email,
    password,
  } = req.body;
  if (!name || !email || !password) {
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
        name,
        email,
        password: hashedPassword,
        institutionDetails: { institutionName },
      });
      if (student) {
        generateToken(res, student._id, "student");
        res.status(200).json({
          message: "Student Registered Successfully",
          data: { _id: student._id, name: student.name, email: student.email },
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
      res
        .status(200)
        .json({ _id: student._id, name: student.name, email: student.email });
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
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }
    res.status(200).json(student);
  } catch (error) {
    throw new Error(error.message);
  }
});

// Update student data
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    dateOfBirth,
    address,
    mobile,
    phone,
    institutionDetails,
  } = req.body;

  if ((!dateOfBirth || !address, !mobile, !phone, !institutionDetails)) {
    res.status(500);
    throw new Error("Fill out every field");
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ message: "Student data updated", data: updatedStudent });
  } catch (error) {
    throw new Error(error.message);
  }
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentById,
  updateStudent,
};
