import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
const app = express();

connectDB();
//Middleware
app.use(cors());
app.use(express.json());
//connect to MONGODB
app.get("/", (req, res) => req.send("MONGODB CONNECTED"));
const PORT = process.env.PORT || 5000;
//Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
