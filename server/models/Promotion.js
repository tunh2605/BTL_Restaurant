import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },

  type: {
    type: String,
    enum: ["food", "reservation"],
  },

  discountType: {
    type: String,
    enum: ["percent", "fixed"],
  },

  discountValue: Number,

  startDate: Date,
  endDate: Date,

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Promotion", promotionSchema);
