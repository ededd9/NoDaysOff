import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";
const router = express.Router();
//get all users
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("name bio");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//get own full private profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email bio workoutLog postLog following")
      .populate("workoutLog");
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/search", protect, async (req, res) => {
  try {
    //destructure name user on frontend searches for
    const { name } = req.query;
    //empty search ? -> return empty array
    if (!name || name.trim() === "") {
      return res.json([]);
    }
    //using regex, find any user whose name contains "xx", case insensitive
    //return only name, limit results by 10
    const users = await User.find({
      name: { $regex: name, $options: "i" },
    })
      .select("name")
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//get specific user from id
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name bio following workoutLog postLog")
      .populate("workoutLog")
      .exec();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// toggle follow status
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
        { $pull: { following: new mongoose.Types.ObjectId(targetUserId) } },
      );
    } else {
      await User.updateOne(
        { _id: currentUserId },
        { $push: { following: new mongoose.Types.ObjectId(targetUserId) } },
      );
    }

    res.json({
      status: "success",
      action: isFollowing ? "unfollowed" : "followed",
      following: !isFollowing,
    });
    console.log("Success");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Erorr" });
  }
});
// get users following list
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
//check follow status
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
//update user profiel
router.patch("/:id", protect, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updates = Object.keys(req.body);
    const updatesAllowed = ["name", "email", "bio"];
    const isValidUpdate = updates.every((update) =>
      updatesAllowed.includes(update),
    );
    if (!isValidUpdate)
      return res.status(400).json({ message: "Invalid updates!" });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
export default router;
