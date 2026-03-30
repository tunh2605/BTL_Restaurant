import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },

  name: String,
  phone: String,

  date: Date,
  time: String,

  numberOfPeople: Number,

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },

  note: String,

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Reservation", reservationSchema);
