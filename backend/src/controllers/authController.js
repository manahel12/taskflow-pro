import bcrypt from "bcryptjs";
import crypto from "crypto";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { sendResetEmail } from "../utils/sendEmail.js";

function validationCheck(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    settings: {
      notifications: user.settings?.notifications !== false,
      darkMode: user.settings?.darkMode === true
    }
  };
}

export async function register(req, res, next) {
  try {
    if (!validationCheck(req, res)) return;
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: signToken(user._id), user: safeUser(user) });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    if (!validationCheck(req, res)) return;
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user._id), user: safeUser(user) });
  } catch (err) { next(err); }
}

export async function profile(req, res) {
  res.json({ user: safeUser(req.user) });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, avatar } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), avatar: avatar || "" },
      { new: true }
    );
    res.json({ user: safeUser(user) });
  } catch (err) { next(err); }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Current password and a new password of at least 6 characters are required" });
    }
    const user = await User.findById(req.user._id).select("+password");
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) { next(err); }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If the account exists, a reset email has been requested." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;
    const result = await sendResetEmail(user.email, resetUrl);

    const response = { message: "If the account exists, a reset email has been requested." };
    if (!result.sent) response.developmentResetUrl = resetUrl;
    res.json(response);
  } catch (err) { next(err); }
}

export async function resetPassword(req, res, next) {
  try {
    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) return res.status(400).json({ message: "Reset token is invalid or expired" });

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) { next(err); }
}
