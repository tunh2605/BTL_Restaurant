import express from "express";
import { verifyAdmin, verifyHQAdmin } from "../middleware/auth.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats,
  getDashboardStats,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Dashboard stats (users + reservations)
adminRouter.get("/dashboard-stats", verifyAdmin, getDashboardStats);

// User management
adminRouter.get("/users", verifyAdmin, getAllUsers);
adminRouter.get("/users/stats", verifyAdmin, getUserStats);
adminRouter.put("/users/:id/role", verifyHQAdmin, updateUserRole);
adminRouter.delete("/users/:id", verifyAdmin, deleteUser);

export default adminRouter;
