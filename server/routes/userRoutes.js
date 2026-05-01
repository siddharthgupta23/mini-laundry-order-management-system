import express from "express";
import { getUsers, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// All user routes are for admin only
router.use(verifyToken, requireRole("admin"));

router.get("/", getUsers);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", updateUserStatus);

export default router;
