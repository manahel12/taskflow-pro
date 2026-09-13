import { validationResult } from "express-validator";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return false;
  }
  return true;
}

export async function getTasks(req, res, next) {
  try {
    const { search, category, priority, status } = req.query;
    const filter = { user: req.user._id, isDeleted: false };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;
    if (priority && priority !== "All") filter.priority = priority;
    if (status && status !== "All") filter.status = status;

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) { next(err); }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const data = { ...req.body, user: req.user._id };
    const task = await Task.create(data);
    await Notification.create({
      user: req.user._id,
      title: "Task created",
      text: `“${task.title}” was added to your task list.`,
      type: "task"
    });
    res.status(201).json(task);
  } catch (err) { next(err); }
}

export async function updateTask(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    await Notification.create({
      user: req.user._id,
      title: "Task updated",
      text: `“${task.title}” was updated successfully.`,
      type: "task"
    });
    res.json(task);
  } catch (err) { next(err); }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    await Notification.create({
      user: req.user._id,
      title: "Task deleted",
      text: `“${task.title}” was removed from your task list.`,
      type: "task"
    });
    res.json({ message: "Task deleted successfully" });
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) { next(err); }
}
