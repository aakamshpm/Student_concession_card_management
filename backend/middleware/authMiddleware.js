import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = (role) => {
  return asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    //getting token via Bearer header (POSTMAN)
    // if (
    //   !token &&
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer")
    // ) {
    //   token = req.headers.authorization.split(" ")[1];
    // }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
          res.status(403); // Forbidden status for role mismatch
          throw new Error("Invalid role");
        }
        if (role === "student") {
          req.studentId = decoded.userId;
        } else if (role === "admin") {
          req.adminId = decoded.userId;
        }
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
};

export { protect };
