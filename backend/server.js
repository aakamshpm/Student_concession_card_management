import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { ADMIN_FRONTEND_URL, STUDENT_FRONTEND_URL } from "./utils/constants.js";

dotenv.config();

//DB connection
connectDB();

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: [STUDENT_FRONTEND_URL, ADMIN_FRONTEND_URL],
    credentials: true,
  })
);

//middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder uploads
const uploadsPath = path.resolve("./uploads");
app.use("/uploads", express.static(uploadsPath));

//Routes
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
