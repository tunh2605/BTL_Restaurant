import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "vnpay", "momo", "zalopay"],
      default: "vnpay",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    // Mã giao dịch từ VNPay (vnp_TransactionNo)
    transactionId: {
      type: String,
      default: null,
    },
    // Mã tham chiếu đơn hàng gửi lên VNPay (vnp_TxnRef)
    txnRef: {
      type: String,
      unique: true,
      required: true,
    },
    // Raw response từ VNPay để audit
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
