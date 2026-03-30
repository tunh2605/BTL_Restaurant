import express from "express";
import {
  addFood,
  deleteFood,
  getFoodById,
  getFoods,
  updateFood,
} from "../controllers/foodController.js";
import { verifyHQAdmin } from "../middleware/auth.js";

const foodRouter = express.Router();

// nguoi dung va admin
foodRouter.get("/all-foods", getFoods);
foodRouter.get("/:id", getFoodById);

// option cho hq admin, chi hq admin moi duoc them, sua, xoa mon an
foodRouter.post("/add", verifyHQAdmin, addFood);
foodRouter.put("/update/:id", verifyHQAdmin, updateFood);
foodRouter.delete("/delete/:id", verifyHQAdmin, deleteFood);

export default foodRouter;
