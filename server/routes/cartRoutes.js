import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const cartRouter = express.Router();

// tất cả cart routes đều cần xác thực
cartRouter.get("/", verifyToken, getCart);
cartRouter.post("/add", verifyToken, addToCart);
cartRouter.put("/update/:itemId", verifyToken, updateCartItem);
cartRouter.delete("/remove/:itemId", verifyToken, removeFromCart);
cartRouter.delete("/clear", verifyToken, clearCart);

export default cartRouter;
