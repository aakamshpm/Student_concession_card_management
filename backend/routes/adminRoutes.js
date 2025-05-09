import express from "express";
import {
  approveStudentConcessionCard,
  authAdmin,
  getAllStudents,
  getStudentById,
  getStudentsAppliedForApplication,
  getStudentsAppliedForEligibility,
  logoutAdmin,
  verifyQR,
  verifyStudentId,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/auth", authAdmin);
router.post("/logout", logoutAdmin);

router.get("/all-students", getAllStudents);
router.get("/get-student/:id", getStudentById);
router.get("/students-eligibility", getStudentsAppliedForEligibility);
router.get("/students-application", getStudentsAppliedForApplication);

router.post("/verify-student", verifyStudentId);
router.post("/approve-concession", approveStudentConcessionCard);

router.post("/verify-qr", verifyQR);

export default router;
