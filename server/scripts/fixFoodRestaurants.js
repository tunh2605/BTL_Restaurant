import mongoose from "mongoose";
import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";
import dotenv from "dotenv";
dotenv.config();
const fixFoodRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const validRestaurants = await Restaurant.find().select("_id");

    await Food.updateMany(
      {},
      {
        $pull: {
          restaurants: { $nin: validRestaurants.map((r) => r._id) },
        },
      },
    );

    console.log("✅ Cleaned invalid restaurant references");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixFoodRestaurants();
