import connectDB from "./configs/db.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);

export default app;
