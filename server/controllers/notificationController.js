import AdminNotification from "../models/AdminNotification.js";

// ADMIN: Lấy tất cả notifications (mới nhất trước)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await AdminNotification.countDocuments({ isRead: false });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ADMIN: Đánh dấu đã đọc một notification
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await AdminNotification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!noti) return res.status(404).json({ message: "Không tìm thấy." });

    res.json({ message: "Đã đánh dấu đọc.", noti });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ADMIN: Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    await AdminNotification.updateMany({ isRead: false }, { isRead: true, readAt: new Date() });
    res.json({ message: "Đã đánh dấu tất cả là đã đọc." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ADMIN: Xóa một notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await AdminNotification.findByIdAndDelete(id);
    if (!noti) return res.status(404).json({ message: "Không tìm thấy." });
    res.json({ message: "Đã xóa thông báo." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ADMIN: Xóa tất cả notification đã đọc
export const deleteAllRead = async (req, res) => {
  try {
    await AdminNotification.deleteMany({ isRead: true });
    res.json({ message: "Đã xóa tất cả thông báo đã đọc." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
