import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },

  totalPrice: Number,
  note: String,

  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "completed", "cancelled"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "online", "vnpay", "momo", "zalopay"],
  },

  isPaid: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
