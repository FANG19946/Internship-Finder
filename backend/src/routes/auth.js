import express from "express";
import axios from "axios";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Redirect user to GitHub for authentication
router.get("/github", (req, res) => {
  const redirectUri = "http://localhost:5000/api/auth/github/callback";
  const clientId = process.env.GITHUB_CLIENT_ID;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

// Handle GitHub callback after login
router.get("/github/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing authorization code" });

  let accessToken;
  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).json({ error: "No access token received" });
  } catch (err) {
    console.error("Token exchange failed:", err.response?.data || err.message);
    return res.status(500).json({ error: "GitHub token exchange failed" });
  }

  let githubUser;
  try {
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    githubUser = userRes.data;
  } catch (err) {
    console.error("GitHub user fetch failed:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch GitHub user" });
  }

  const { id, login, name } = githubUser;

  try {
    let user = await User.findOne({ githubId: id });
    if (!user) {
      user = await User.create({ githubId: id, username: login, name });
      console.log("New user:", login);
    } else {
      console.log("Returning user:", login);
    }
    return res.redirect(`http://localhost:5173/profile?id=${user._id}`);
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Database operation failed" });
  }
});


// TEST Routes
// Basic Signup
// Signup
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password)
//     return res.status(400).json({ error: "Missing fields" });

//   try {
//     let existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ error: "User already exists" });

//     const user = await User.create({ name, email, password });
//     return res.json({ message: "User registered successfully", user });
//   } catch (err) {
//     console.error("DB error:", err);
//     return res.status(500).json({ error: "Database error" });
//   }
// });

// // Basic Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: "Missing fields" });

//   try {
//     const user = await User.findOne({ email, password });
//     if (!user)
//       return res.status(400).json({ error: "Invalid credentials" });

//     return res.json({ message: "Login successful", user });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Database error" });
//   }
// });


export default router;
