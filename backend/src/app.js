import "./db.js"
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // import auth routes
import profileRoutes from "./routes/profile.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // all auth routes will be prefixed with /api/auth
app.use("/api/profile", profileRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

export default app;
