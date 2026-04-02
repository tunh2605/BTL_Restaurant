import connectDB from "./configs/db.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/restaurants", restaurantRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
