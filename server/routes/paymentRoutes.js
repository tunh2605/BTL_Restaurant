import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import {
  createVNPayUrl,
  verifyReturn,
  vnpayIPN,
  getAllPayments,
  testCreateUrl,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// TEST: không cần auth
paymentRouter.get("/test-url", testCreateUrl);

// User tạo URL thanh toán
paymentRouter.post("/create-url", verifyToken, createVNPayUrl);

// FE gọi sau khi VNPay redirect về để verify kết quả
paymentRouter.get("/verify-return", verifyReturn);

// VNPay gọi IPN (server-to-server) — không cần auth
paymentRouter.get("/ipn", vnpayIPN);

// Admin xem lịch sử
paymentRouter.get("/", verifyAdmin, getAllPayments);

export default paymentRouter;
