import Notification from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    let notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);

    if (notifications.length === 0) {
      notifications = await Notification.insertMany([
        { user: req.user._id, title: "Welcome to TaskFlow Pro", text: "Your workspace is ready. Start by adding a task.", type: "system" },
        { user: req.user._id, title: "Stay on track", text: "Review your tasks and keep your priorities up to date.", type: "system" }
      ]);
    }

    res.json(notifications);
  } catch (err) { next(err); }
}

export async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) { next(err); }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) { next(err); }
}
