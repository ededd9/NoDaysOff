// controllers/workoutLogController.js
import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import User from "../models/User.js";

export const addWorkoutLog = async (req, res) => {
  try {
    const { date, name, sets, reps, weight } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!date || !name || !sets || !reps || !weight) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exercise = {
      name,
      sets: Array.from({ length: parseInt(sets) }, (_, i) => ({
        setNumber: i + 1,
        reps: parseInt(reps),
        weight: parseFloat(weight),
      })),
    };

    // Upsert workout
    const workout = await Workout.findOneAndUpdate(
      { user: userId, date: new Date(date) },
      { $push: { exercises: exercise } },
      { new: true, upsert: true }
    );

    // Only update user ref if new workout
    if (workout.$isNew) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { workoutLog: workout._id },
      });
    }

    res.status(200).json({
      success: true,
      message: workout.$isNew ? "Workout created" : "Exercise added",
      workout,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Failed to save workout",
      error: error.message,
    });
  }
};
