import User from "../models/User.js";

export const addWorkoutLog = async (req, res) => {
  try {
    const { date, name, sets, reps, weight } = req.body;
    const userId = req.user._id;

    // Create the exercise with sets
    const exercise = {
      name,
      sets: Array.from({ length: sets }, (_, i) => ({
        setNumber: i + 1,
        reps: parseInt(reps),
        weight: parseFloat(weight),
      })),
    };

    // Find or create workout log for this date
    const user = await User.findById(userId);

    // Check if workout exists for this date
    const workoutIndex = user.workoutLog.findIndex(
      (log) => log.date.toISOString().split("T")[0] === date
    );

    if (workoutIndex >= 0) {
      // Add to existing workout
      user.workoutLog[workoutIndex].exercises.push(exercise);
    } else {
      // Create new workout
      user.workoutLog.push({
        date: new Date(date),
        exercises: [exercise],
      });
    }

    await user.save();
    res.status(201).json({ success: true });
    console.log("Sucess in adding workout!");
  } catch (error) {
    console.error("Error adding workout:", error);
    res.status(400).json({ message: error.message });
  }
};
