import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { getTasks, getTask, createTask, updateTask, deleteTask, updateStatus } from "../controllers/taskController.js";

const router = Router();
router.use(protect);

const taskValidation = [
  body("title").trim().isLength({ min: 1, max: 150 }).withMessage("Task title is required"),
  body("priority").optional().isIn(["High", "Medium", "Low"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status")
];

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", taskValidation, createTask);
router.put("/:id", taskValidation, updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/status", updateStatus);

export default router;
