import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },

  restaurants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    validate: [(v) => v.length > 0, "Phải có ít nhất 1 nhà hàng"],
  },

  discountType: {
    type: String,
    enum: ["percent", "fixed"],
  },

  discountValue: Number,

  startDate: Date,
  endDate: Date,

  isActive: { type: Boolean, default: true },

  minOrderValue: { type: Number, default: 0 }, // đơn tối thiểu để áp dụng
  maxDiscount: { type: Number, default: null }, // trần giảm giá (chỉ áp dụng với discountType là "percent")
  usageLimit: { type: Number, default: null }, // giới hạn lượt dùng toàn hệ thống
  usedCount: { type: Number, default: 0 }, // đã dùng bao nhiêu lần
  type: { type: String, enum: ["food", "reservation", "order"] }, // giảm giá cho món ăn, đặt bàn hay đơn hàng

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Promotion", promotionSchema);
