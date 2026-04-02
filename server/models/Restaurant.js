import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    images: {
      type: [
        {
          url: String,
          public_id: String,
        },
      ],
      default: [],
    },

    openTime: { type: String, required: true, default: "09:00" },
    closeTime: { type: String, required: true, default: "21:00" },
  },
  { timestamps: true },
);

export default mongoose.model("Restaurant", restaurantSchema);
