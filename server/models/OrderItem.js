import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },

  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },

  name: String,
  price: Number,
  quantity: Number,
});

export default mongoose.model("OrderItem", orderItemSchema);
