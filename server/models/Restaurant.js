import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    image: String,

    openTime: String,
    closeTime: String,
  },
  { timestamps: true },
);

export default mongoose.model("Restaurant", restaurantSchema);
