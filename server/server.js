import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
dotenv.config();
const app = express();

connectDB();
//Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);
app.use(express.json());
//Req logging middleware
app.use((req, res, next) => {
  console.log("====================================================");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("====================================================");
  next();
});
//connect to MONGODB
//line 23?
app.get("/", (req, res) => {
  res.status(200).send("Server is running and MongoDb is connected");
});

const PORT = process.env.PORT || 5050;

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/workouts", workoutRoutes);

app.use("/api/users", userRoutes);
//know what port is being used
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
