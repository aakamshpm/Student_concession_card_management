import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = (role) => {
  return asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
          res.status(403); // Forbidden status for role mismatch
          throw new Error("Invalid role");
        }
        if (role === "student") {
          req.studentId = decoded.id;
        } else if (role === "admin") {
          req.adminId = decoded.id;
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
