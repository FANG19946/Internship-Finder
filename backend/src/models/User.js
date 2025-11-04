// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  name: String,
  createdAt: { type: Date, default: Date.now },

  //  Extended fields for resume/profile 
  title: String,
  email: String,
  phone: String,
  address: String,
  links: [String],
  skills: [String],
  education: [
    {
      degree: String,
      institution: String,
      graduation: String,
      cgpa: String,
    },
  ],
  experiences: [
    {
      role: String,
      company: String,
      duration: String,
      description: [String],
    },
  ],
  projects: [
    {
      title: String,
      company: String,
      duration: String,
      description: [String],
    },
  ],
  achievements: [String],
});

const User = mongoose.model("User", userSchema);
export default User;
