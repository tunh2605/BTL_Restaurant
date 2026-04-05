import express from "express";
import { verifyAdmin } from "../middleware/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyAdmin, getNotifications);
notificationRouter.put("/:id/read", verifyAdmin, markAsRead);
notificationRouter.put("/read-all", verifyAdmin, markAllAsRead);

export default notificationRouter;
