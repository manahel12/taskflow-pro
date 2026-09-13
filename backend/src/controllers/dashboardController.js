import Task from "../models/Task.js";

export async function stats(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id, isDeleted: false });
    const now = new Date();
    const count = value => tasks.filter(t => t.status === value).length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== "Completed").length;

    res.json({
      total: tasks.length,
      completed: count("Completed"),
      pending: count("Pending"),
      inProgress: count("In Progress"),
      overdue
    });
  } catch (err) { next(err); }
}

export async function chart(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id, isDeleted: false });
    const status = ["Pending", "In Progress", "Completed"].map(name => ({
      name, value: tasks.filter(t => t.status === name).length
    }));
    const priority = ["High", "Medium", "Low"].map(name => ({
      name, value: tasks.filter(t => t.priority === name).length
    }));
    const categories = [...new Set(tasks.map(t => t.category))].map(name => ({
      name, value: tasks.filter(t => t.category === name).length
    }));
    res.json({ status, priority, categories });
  } catch (err) { next(err); }
}

export async function upcoming(req, res, next) {
  try {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const tasks = await Task.find({
      user: req.user._id,
      isDeleted: false,
      status: { $ne: "Completed" },
      dueDate: { $gte: start, $lte: end }
    }).sort({ dueDate: 1 }).limit(10);
    res.json(tasks);
  } catch (err) { next(err); }
}
