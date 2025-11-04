import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET profile by user ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT profile to update/add fields
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
