import "./db.js"
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // import auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // all auth routes will be prefixed with /api/auth

// Default route
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

export default app;
