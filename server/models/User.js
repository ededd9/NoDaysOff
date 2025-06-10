import mongoose from "mongoose";
import argon2 from "argon2";

//user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  workoutLog: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
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
