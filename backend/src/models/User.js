import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: "" },
  role: { type: String, default: "user" },
  settings: {
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
