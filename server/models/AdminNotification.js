import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "new_order",
      "new_reservation",
      "payment_success",
      "payment_failed",
      "order_cancelled",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  // Noti thuộc chi nhánh nào (null = tất cả)
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    default: null,
  },
  // Admin nào nhận (null = tất cả admin)
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // Loại tài liệu liên quan (để điều hướng FE)
  refType: {
    type: String,
    enum: ["Order", "Reservation", "Payment"],
    default: null,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AdminNotification", adminNotificationSchema);
