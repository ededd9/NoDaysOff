import express from "express";
import User from "../models/User.js";
import { addWorkoutLog } from "../Controller/workoutLogController.js";
import { protect } from "../middleware/auth.js";
import Workout from "../models/Workout.js";
const router = express.Router();
router.use(protect);
router.post("/", addWorkoutLog);

// Get all workouts for the logged-in user
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json({
      status: "success",
      data: workouts,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// Get a single workout
router.get("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure user owns this workout
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete a single workout exercise
router.delete("/:workoutId/exercises/:exerciseIndex", async (req, res) => {
  try {
    const { workoutId, exerciseIndex } = req.params;
    const workout = await Workout.findOne({
      _id: workoutId,
      user: req.user._id,
    });
    console.log(workoutId);
    console.log(workout);

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    workout.exercises.splice(exerciseIndex, 1); // Remove exercise by index
    if (workout.exercises.length === 0) {
      await Workout.deleteOne({ _id: workoutId });
      return res
        .status(200)
        .json({ message: "Workout deleted as no excercies are left" });
    } else {
      await workout.save();
      res.status(200).json({ message: "Exercise deleted", data: workout });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
