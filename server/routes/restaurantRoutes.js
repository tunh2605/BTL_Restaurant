import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  getRestaurantStats,
  updateRestaurant,
} from "../controllers/restaurantController.js";
import { verifyHQAdmin } from "../middleware/auth.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/all-restaurants", getRestaurants);
restaurantRouter.get("/stats", getRestaurantStats);
restaurantRouter.get("/:id", getRestaurantById);

restaurantRouter.post("/add", verifyHQAdmin, addRestaurant);
restaurantRouter.put("/update/:id", verifyHQAdmin, updateRestaurant);
restaurantRouter.delete("/delete/:id", verifyHQAdmin, deleteRestaurant);
export default restaurantRouter;
