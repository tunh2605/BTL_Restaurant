import User from "../models/User.js";
import Reservation from "../models/Reservation.js";
import Order from "../models/Order.js";

// ─── ADMIN: Lấy tất cả người dùng ────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Lấy số lượng đặt bàn cho từng user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const reservationCount = await Reservation.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          reservationCount,
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Cập nhật vai trò người dùng ──────────────────────────────────────
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ." });
    }

    // Không cho phép tự thay đổi quyền của chính mình
    if (req.user.id === id) {
      return res.status(400).json({ message: "Không thể thay đổi quyền của chính mình." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json({ message: "Cập nhật vai trò thành công.", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Xoá người dùng ───────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép tự xoá chính mình
    if (req.user.id === id) {
      return res.status(400).json({ message: "Không thể xoá tài khoản của chính mình." });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json({ message: "Xoá người dùng thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Thống kê tổng quan users ─────────────────────────────────────────
export const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const userCount = await User.countDocuments({ role: "user" });

    // Mới tháng này
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.json({ total, adminCount, userCount, newThisMonth });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Thống kê dashboard (users + reservations) ────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: "pending" });
    const confirmedReservations = await Reservation.countDocuments({ status: "confirmed" });

    // Users mới tháng này
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Reservations tháng này và tháng trước
    const reservationsThisMonth = await Reservation.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const reservationsLastMonth = await Reservation.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    res.json({
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalReservations,
      reservationsThisMonth,
      reservationsLastMonth,
      pendingReservations,
      confirmedReservations,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
