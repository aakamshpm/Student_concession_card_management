import express from "express";
import { authAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/auth", authAdmin);

export default router;
