import User from "../models/User.js";

export async function getSettings(req, res) {
  res.json({ settings: {
    notifications: req.user.settings?.notifications !== false,
    darkMode: req.user.settings?.darkMode === true
  }});
}

export async function updateSettings(req, res, next) {
  try {
    const updates = {};
    if (typeof req.body.notifications === "boolean") updates["settings.notifications"] = req.body.notifications;
    if (typeof req.body.darkMode === "boolean") updates["settings.darkMode"] = req.body.darkMode;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    res.json({ settings: {
      notifications: user.settings?.notifications !== false,
      darkMode: user.settings?.darkMode === true
    }});
  } catch (err) { next(err); }
}
