import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  updateStudent,
  applyForCard,
  applyForVerification,
  uploadIdCard,
  checkVerificationStatus,
  getStudentDetails,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", protect("student"), getStudentDetails);
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);
router.post("/update", protect("student"), updateStudent);
router.post(
  "/upload-id-card",
  protect("student"),
  upload.single("studentIdCard"),
  uploadIdCard
);
router.post("/verify", protect("student"), applyForVerification);
router.get("/check-verification", protect("student"), checkVerificationStatus);
router.post("/apply", protect("student"), applyForCard);

export default router;
