import express from "express";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentById,
  updateStudent,
  applyForCard,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/id", protect("student"), getStudentById);
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);
router.post("/update", protect("student"), updateStudent);
router.post("/apply", protect("student"), applyForCard);

export default router;
