import express from "express";
import User from "../models/User.js";
import { es } from "date-fns/locale";
import jwt from "jsonwebtoken";
const router = express.Router();

//SIGNUP API ENDPOINT
router.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");
    console.log("Found user:", user);

    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ status: "fail", message: "Invalid creds" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      token,
      data: { user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
});
export default router;
