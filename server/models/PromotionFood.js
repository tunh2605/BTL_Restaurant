import mongoose from "mongoose";

const promotionFoodSchema = new mongoose.Schema({
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
  },

  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
});

export default mongoose.model("PromotionFood", promotionFoodSchema);
