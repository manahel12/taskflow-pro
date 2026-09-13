import { Router } from "express";
import { body } from "express-validator";
import { register, login, forgotPassword, resetPassword, profile, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], register);

router.post("/login", [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required")
], login);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
