import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", verifyToken, createOrder);
orderRouter.get("/my", verifyToken, getMyOrders);
orderRouter.get("/", verifyAdmin, getAllOrders);
orderRouter.put("/:id/status", verifyAdmin, updateOrderStatus);

export default orderRouter;
