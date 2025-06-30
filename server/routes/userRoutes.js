import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";
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

router.put("/:id/follow", protect, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if following already
    const isFollowing = await User.exists({
      _id: currentUserId,
      following: new mongoose.Types.ObjectId(targetUserId),
    });

    if (isFollowing) {
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { following: new mongoose.Types.ObjectId(targetUserId) } }
      );
    } else {
      await User.updateOne(
        { _id: currentUserId },
        { $push: { following: new mongoose.Types.ObjectId(targetUserId) } }
      );
    }

    res.json({
      status: "success",
      action: isFollowing ? "unfollowed" : "followed",
      following: !isFollowing,
    });
    console.log("Success");
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      stack: err.stack,
    });
  }
});
router.get("/:id/is-following", protect, async (req, res) => {
  try {
    const isFollowing = await User.exists({
      _id: req.user.id,
      following: new mongoose.Types.ObjectId(req.params.id),
    });
    res.json({ isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/following", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("following")
      .populate("following", "name avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
