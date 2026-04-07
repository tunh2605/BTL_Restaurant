import mongoose from "mongoose";
const promotionUsageSchema = new mongoose.Schema({
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  discountAmount: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now },
});
export default mongoose.model("PromotionUsage", promotionUsageSchema);
