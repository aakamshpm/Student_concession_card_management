import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";

const authAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    throw new Error("Enter required fields");
  }

  try {
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      res.status(404);
      throw new Error("Not authorized");
    }
    if (await bcrypt.compare(password, admin.password)) {
      generateToken(res, admin._id, "admin");
      res.status(200).json({
        message: "Admin login successful",
        data: { id: admin._id, name: admin.name },
      });
    } else {
      res.status(401);
      throw new Error("Password does not match");
    }
  } catch (err) {
    res.status(401);
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

export {
  authAdmin,
  getStudentsAppliedForEligibility,
  getStudentsAppliedForApplication,
  verifyStudentId,
  approveStudentConcessionCard,
};

// Format the neccessary fields for concession card
const formatData = (data) => {
  const formatedData = {
    name: data.firstName + " " + data.lastName,
    age: data.age,
    dateOfBirth: data.dateOfBirth.toLocaleDateString(),
    institutionDetails: data.institutionDetails,
    routes: data.routes,
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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve("./templates/concession-template.html");

    const htmlContent = populateTemplate(templatePath, formatData(studentData));

    await page.setContent(htmlContent);

    // Create the card pdf
    const outputFileName = `concession_card_${studentData._id}.pdf`;
    await page.pdf({
      path: `./uploads/concession-cards/${outputFileName}`,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return outputFileName;
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(error.message);
  }
};
