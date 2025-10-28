import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  console.log("Database name:", mongoose.connection.name);  // <-- add this
})
.catch(err => console.log("MongoDB connection error:", err));
