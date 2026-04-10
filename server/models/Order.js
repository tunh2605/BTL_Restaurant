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

  totalPrice: Number, // giá gốc
  discount: { type: Number, default: 0 }, // số tiền giảm
  finalPrice: Number, // giá sau giảm

  promotion: {
    promotionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
    name: String,
    discountType: String, // percent | fixed
    discountValue: Number,
  },

  note: String,

  phone: {
    type: String,
    required: true,
  },

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
