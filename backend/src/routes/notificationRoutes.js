import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notificationController.js";

const router = Router();
router.use(protect);
router.get("/", getNotifications);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);

export default router;
