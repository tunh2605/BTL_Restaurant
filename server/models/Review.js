import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },

  name: String,
  avatar: String,

  rating: { type: Number, min: 1, max: 5 },
  comment: String,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
