import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: String,

    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "admin", "hqadmin"],
      default: "user",
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
