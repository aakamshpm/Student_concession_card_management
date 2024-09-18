import express from "express";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getStudentById,
  updateStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/id/:id", protect("student"), getStudentById);
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", logoutStudent);
router.post("/update/:id", protect("student"), updateStudent);

export default router;
