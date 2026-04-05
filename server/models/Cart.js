import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // mỗi user chỉ có 1 giỏ hàng
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartSchema);
