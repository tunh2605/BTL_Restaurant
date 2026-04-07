import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import AdminNotification from "../models/AdminNotification.js";

// ─── USER: Tạo đặt bàn mới ────────────────────────────────────────────────────
export const createReservation = async (req, res) => {
  try {
    const { name, phone, date, time, numberOfPeople, note } = req.body;

    if (!name || !phone || !date || !time || !numberOfPeople) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin." });
    }

    const reservation = await Reservation.create({
      user: req.user?.id || null,
      name,
      phone,
      date,
      time,
      numberOfPeople,
      note: note || "",
      status: "pending",
    });

    // Tạo notification cho admin
    await AdminNotification.create({
      type: "new_reservation",
      title: "Đặt bàn mới",
      message: `${name} vừa đặt bàn cho ${numberOfPeople} người vào ${date} lúc ${time}`,
      refType: "Reservation",
      refId: reservation._id,
    });

    res.status(201).json({ message: "Đặt bàn thành công.", reservation });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── USER: Lấy đặt bàn của user hiện tại ─────────────────────────────────────
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Lấy tất cả đặt bàn ───────────────────────────────────────────────
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Cập nhật trạng thái đặt bàn ─────────────────────────────────────
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    ).populate("user", "name email avatar");

    if (!reservation) {
      return res.status(404).json({ message: "Không tìm thấy đặt bàn." });
    }

    res.json({ message: "Cập nhật trạng thái thành công.", reservation });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Xoá đặt bàn ──────────────────────────────────────────────────────
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ message: "Không tìm thấy đặt bàn." });
    }

    res.json({ message: "Xoá đặt bàn thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Thống kê tổng quan reservations ───────────────────────────────────
export const getReservationStats = async (req, res) => {
  try {
    const total = await Reservation.countDocuments();
    const pending = await Reservation.countDocuments({ status: "pending" });
    const confirmed = await Reservation.countDocuments({ status: "confirmed" });
    const completed = await Reservation.countDocuments({ status: "completed" });
    const cancelled = await Reservation.countDocuments({ status: "cancelled" });

    res.json({ total, pending, confirmed, completed, cancelled });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
