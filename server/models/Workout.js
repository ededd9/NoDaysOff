import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  sets: [
    {
      setNumber: {
        type: Number,
        required: true,
        min: 1,
      },
      reps: {
        type: Number,
        required: true,
        min: 1,
      },
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

workoutSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Workout", workoutSchema);
