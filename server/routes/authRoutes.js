import express from "express";
import User from "../models/User.js";
import { es } from "date-fns/locale";
import jwt from "jsonwebtoken";
const router = express.Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
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
    console.log("Session object:", req.session);
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

    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "100d",
    });

    req.session.refreshToken = refreshToken;
    res.status(200).json({
      status: "success",
      accessToken,
      data: { user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
});

router.post("/refresh", (req, res) => {
  const token = req.session?.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });

    const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ accessToken: newAccessToken });
  });
});
export default router;
