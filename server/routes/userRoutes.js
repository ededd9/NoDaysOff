import express from "express";
import User from "../models/User.js";
const router = express.Router();
//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get specific user from id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("workoutLog")
      .exec();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
