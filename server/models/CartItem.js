import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    name: String, // snapshot tên món tại thời điểm thêm vào giỏ
    price: Number, // snapshot giá tại thời điểm thêm vào giỏ
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CartItem", cartItemSchema);
