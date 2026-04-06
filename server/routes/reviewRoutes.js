import express from "express";
import {
  createReview,
  deleteReview,
  getReviewFoodByUserId,
  getReviewsByFoodId,
  updateReview,
} from "../controllers/reviewController.js";

import { verifyToken } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.get(
  "/user-review/:userId/:foodId",
  verifyToken,
  getReviewFoodByUserId,
);
reviewRouter.get("/food/:foodId", getReviewsByFoodId);
reviewRouter.post("/add", verifyToken, createReview);
reviewRouter.delete("/delete/:reviewId", verifyToken, deleteReview);
reviewRouter.put("/update/:reviewId", verifyToken, updateReview);
export default reviewRouter;
