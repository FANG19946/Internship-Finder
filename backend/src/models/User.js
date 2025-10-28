import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,       // GitHub login
  name: String,           // optional, can be filled later
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
