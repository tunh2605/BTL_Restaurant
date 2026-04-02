import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],

    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Food", foodSchema);
