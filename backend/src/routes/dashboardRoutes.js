import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { stats, chart, upcoming } from "../controllers/dashboardController.js";

const router = Router();
router.use(protect);
router.get("/stats", stats);
router.get("/chart", chart);
router.get("/upcoming", upcoming);

export default router;
