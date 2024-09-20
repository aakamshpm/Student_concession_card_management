import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

//DB connection
connectDB();

const app = express();

//middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Routes
app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
