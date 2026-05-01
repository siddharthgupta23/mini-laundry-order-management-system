import express from "express";
import { submitFeedback, getFeedback } from "../controllers/feedbackController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", verifyToken, requireRole("admin"), getFeedback);

export default router;
