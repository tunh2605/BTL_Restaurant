import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  getReservationStats,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// User routes
reservationRouter.post("/", verifyToken, createReservation);
reservationRouter.get("/my", verifyToken, getMyReservations);

// Admin routes
reservationRouter.get("/", verifyAdmin, getAllReservations);
reservationRouter.get("/stats", verifyAdmin, getReservationStats);
reservationRouter.put("/:id/status", verifyAdmin, updateReservationStatus);
reservationRouter.delete("/:id", verifyAdmin, deleteReservation);

export default reservationRouter;
