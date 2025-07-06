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
          id: user.id,
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
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
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

    const { password: pw, ...userData } = user.toObject();
    console.log("Sending user data:", userData); // <- this must include _id

    res.status(200).json({
      status: "success",
      accessToken,
      data: { user: userData }, // <- this must include _id
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid creds" });
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

    const newAccessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ accessToken: newAccessToken });
  });
});
export default router;
