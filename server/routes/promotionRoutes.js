import express from "express";
import {
  applyPromotion,
  confirmUsage,
  createPromotion,
  deletePromotion,
  getAvailablePromotions,
  getPromotionById,
  getPromotions,
  getUsageHistory,
  updatePromotion,
} from "../controllers/promotionController.js";
const promotionRouter = express.Router();
import { verifyToken } from "../middleware/auth.js";

promotionRouter.get("/", getPromotions);
promotionRouter.get("/available", getAvailablePromotions);
promotionRouter.get("/:id", getPromotionById);
promotionRouter.post("/add", createPromotion);
promotionRouter.put("/update/:id", updatePromotion);
promotionRouter.delete("/delete/:id", deletePromotion);
promotionRouter.post("/apply", applyPromotion);
promotionRouter.post("/confirm-usage", confirmUsage);
promotionRouter.get("/usage-history", verifyToken, getUsageHistory);

export default promotionRouter;
