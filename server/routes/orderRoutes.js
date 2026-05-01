import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

router.patch("/:id/status", requireRole("admin", "staff"), updateOrderStatus);
router.delete("/:id", requireRole("admin"), deleteOrder);

export default router;
