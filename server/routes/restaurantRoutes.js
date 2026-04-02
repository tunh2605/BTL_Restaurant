import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/all-restaurants", getRestaurants);
restaurantRouter.get("/:id", getRestaurantById);
restaurantRouter.post("/add", addRestaurant);
restaurantRouter.put("/update/:id", updateRestaurant);
restaurantRouter.delete("/delete/:id", deleteRestaurant);

export default restaurantRouter;
