import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";

const authAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    throw new Error("Enter required fields");
  }

  try {
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      res.status(404);
      throw new Error("Not authorized");
    }
    if (await bcrypt.compare(password, admin.password)) {
      generateToken(res, admin._id, "admin");
      res.status(200).json({
        message: "Admin login successful",
        data: { id: admin._id, name: admin.name },
      });
    } else {
      res.status(401);
      throw new Error("Password does not match");
    }
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
});

export { authAdmin };
