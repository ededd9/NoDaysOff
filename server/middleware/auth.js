import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  console.log("Auth Header:", req.headers.authorization);
  try {
    // 1) Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please log in to access this resource",
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // 3) Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
      });
    }

    // 4) Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
