import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, requireRole("admin", "staff"), getDashboardStats);

export default router;
