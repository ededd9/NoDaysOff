import express from "express";
import User from "../models/User.js";
import { addWorkoutLog } from "../Controller/workoutLogController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);
router.post("/", addWorkoutLog);

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET endpoint is working",
    note: "Your POST endpoint for workouts is at the same URL",
  });
});
export default router;
