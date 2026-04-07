import connectDB from "./configs/db.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { auth } from "express-openid-connect";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import reservationRouter from "./routes/reservationRoutes.js";
import { createAuthRouter } from "./routes/authRouter.js";
import { errorMiddleware } from "./errors/errorMiddleware.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import promotionRouter from "./routes/promotionRoutes.js";
import "./configs/cloudinary.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const env = process.env;
const feBase = process.env.FE_BASE_URL || "http://localhost:5173";
// OAuth middleware phải được mount SỚM NHẤT, trước tất cả routes
app.use(
  auth({
    issuerBaseURL: env.ISSUER_BASE_URL,
    baseURL: env.BASE_URL,
    clientID: env.CLIENT_ID,
    secret: env.SECRET,
    clientSecret: env.CLIENT_SECRET,
    authRequired: false,
    idpLogout: false,
    authorizationParams: {
      response_type: "code",
      scope: "openid profile email",
    },
    routes: {
      login: false,
      logout: false,
      callback: "/api/auth/callback",
    },
  }),
);

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
app.use("/api/reservations", reservationRouter);
app.use("/api/auth", createAuthRouter(env));
app.use("/api/payments", paymentRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/promotions", promotionRouter);

// VNPay ReturnUrl proxy — redirect params sang FE
app.get("/payment/return", (req, res) => {
  const qs = new URLSearchParams(req.query).toString();
  res.redirect(`${feBase}/payment/return?${qs}`);
});

// VNPay registered ReturnUrl alias (http://localhost:3000/api/check-payment-vnpay)
app.get("/api/check-payment-vnpay", (req, res) => {
  const qs = new URLSearchParams(req.query).toString();
  res.redirect(`${feBase}/payment/return?${qs}`);
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
