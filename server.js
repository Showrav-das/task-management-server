import cors from "cors";
import "dotenv/config";
import express, { Router } from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./utils/db.js";
const app = express();
const router = Router();

// Middleware
app.use(express.json());
app.use(cors());
app.use(router);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

connectDB();
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
