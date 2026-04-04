import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  getRestaurantStats,
  updateRestaurant,
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/all-restaurants", getRestaurants);
restaurantRouter.get("/stats", getRestaurantStats);
restaurantRouter.post("/add", addRestaurant);
restaurantRouter.put("/update/:id", updateRestaurant);
restaurantRouter.delete("/delete/:id", deleteRestaurant);
restaurantRouter.get("/:id", getRestaurantById);
export default restaurantRouter;
