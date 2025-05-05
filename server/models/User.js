import mongoose from "mongoose";
import argon2 from "argon2";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "Tricep Extensions",
      "Incline Bench Press",
      "Chest Flys",
      "Deadlift",
      "Other",
    ],
    index: true,
  },
  customName: {
    type: String,
    validate: {
      validator: function (v) {
        return this.name !== "Other" || (v && v.length > 0);
      },
    },
    message: "Custom exercise name",
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

const workoutLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);
//user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  workoutLog: [workoutLogSchema],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      hashLength: 32,
    });
    next();
  } catch (err) {
    next(new Error("Password hashing failed: " + err.message));
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await argon2.verify(this.password, candidatePassword);
};

export default mongoose.model("User", userSchema);
