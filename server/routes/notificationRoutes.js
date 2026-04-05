import express from "express";
import { verifyAdmin } from "../middleware/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyAdmin, getNotifications);
notificationRouter.put("/read-all", verifyAdmin, markAllAsRead);
notificationRouter.put("/:id/read", verifyAdmin, markAsRead);
notificationRouter.delete("/delete-read", verifyAdmin, deleteAllRead);
notificationRouter.delete("/:id", verifyAdmin, deleteNotification);

export default notificationRouter;
