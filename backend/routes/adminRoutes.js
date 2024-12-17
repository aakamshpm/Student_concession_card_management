import express from "express";
import {
  approveStudentConcessionCard,
  authAdmin,
  getStudentsAppliedForApplication,
  getStudentsAppliedForEligibility,
  verifyStudentId,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/auth", authAdmin);

router.get("/students-eligibility", getStudentsAppliedForEligibility);
router.get("/students-application", getStudentsAppliedForApplication);

router.post("/verify-student", verifyStudentId);
router.post("/approve-concession", approveStudentConcessionCard);

export default router;
