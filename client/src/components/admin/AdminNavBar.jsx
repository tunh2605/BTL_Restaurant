import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  ShoppingBag,
  CalendarCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// ─── helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

const TYPE_META = {
  new_order: {
    Icon: ShoppingBag,
    color: "text-orange-500",
    bg: "bg-orange-100",
  },
  new_reservation: {
    Icon: CalendarCheck,
    color: "text-yellow-500",
    bg: "bg-yellow-100",
  },
  payment_success: {
    Icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  payment_failed: {
    Icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  order_cancelled: {
    Icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
};

function defaultMeta() {
  return { Icon: Bell, color: "text-[#b09070]", bg: "bg-[#F5F0EB]" };
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── component ───────────────────────────────────────────────────────────────

const AdminNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // ── fetch notifications ──────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotif(true);
      const res = await axios.get(`${API}/api/notifications`);
      const data = res.data;
      setNotifications(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.notifications)
            ? data.notifications
            : [],
      );
    } catch {
      // silent — badge stays at 0
    } finally {
      setLoadingNotif(false);
    }
  }, []);

  // fetch on mount + poll every 30 s
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── mark one as read ─────────────────────────────────────────────────────
  const handleMarkRead = async (notif) => {
    if (notif.isRead) return;
    try {
      await axios.put(`${API}/api/notifications/${notif._id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n,
        ),
      );
    } catch {
      // silent
    }
  };

  // ── mark all as read ─────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API}/api/notifications/read-all`);
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
      );
    } catch {
      // silent
    }
  };

  // ── delete one ───────────────────────────────────────────────────────────
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silent
    }
  };

  // ── delete all read ──────────────────────────────────────────────────────
  const handleDeleteAllRead = async () => {
    try {
      await axios.delete(`${API}/api/notifications/delete-read`);
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch {
      // silent
    }
  };

  // ── close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── toggle notif panel ───────────────────────────────────────────────────
  const toggleNotif = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setDropdownOpen(false);
    if (next) fetchNotifications(); // refresh when opening
  };

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <header className="h-14 bg-white border-b border-[#ede0d4] flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[#F5F0EB] rounded-full px-4 py-2 w-72">
        <Search className="w-4 h-4 text-[#b09070] shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm hệ thống..."
          className="bg-transparent text-sm outline-none text-[#5a3020] placeholder:text-[#c0a080] w-full"
        />
      </div>

      <div className="flex-1" />

      {/* Notification */}
      <div ref={notifRef} className="relative">
        <button
          onClick={toggleNotif}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F0EB] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 text-[#7a6050]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notif dropdown */}
        {notifOpen && (
          <div
            className="absolute right-0 md:left-auto left-0 top-[calc(100%+8px)] w-[calc(100vw-1.5rem)] md:w-96 max-w-96 bg-white rounded-2xl border border-[#ede0d4] shadow-lg z-50 flex flex-col"
            style={{ maxHeight: "480px" }}
          >
            {/* header */}
            <div className="px-4 py-3 border-b border-[#f0e4d8] flex items-center justify-between shrink-0">
              <p className="text-sm font-semibold text-[#5a3020]">
                Thông báo
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#C8714A] hover:underline cursor-pointer"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </div>

            {/* list */}
            <div className="overflow-y-auto flex-1 no-scrollbar">
              {loadingNotif && notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#b09070]">
                  Đang tải...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#b09070]">
                  Không có thông báo
                </div>
              ) : (
                notifications.map((n) => {
                  const { Icon, color, bg } =
                    TYPE_META[n.type] ?? defaultMeta();
                  return (
                    <div
                      key={n._id}
                      onClick={() => handleMarkRead(n)}
                      className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#f8f0ea] last:border-0
                        ${n.isRead ? "bg-white hover:bg-[#fdf8f5]" : "bg-[#fff9f5] hover:bg-[#fdf3ec]"}`}
                    >
                      {/* icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bg}`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>

                      {/* text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug wrap-break-word ${n.isRead ? "text-[#7a6050]" : "text-[#5a3020] font-medium"}`}
                        >
                          {n.title || n.message}
                        </p>
                        {n.title && n.message && (
                          <p className="text-xs text-[#b09070] mt-0.5 wrap-break-word leading-relaxed">
                            {n.message}
                          </p>
                        )}
                        <p className="text-xs text-[#c0a080] mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      {/* right: unread dot + delete */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#C8714A]" />
                        )}
                        <button
                          onClick={(e) => handleDelete(e, n._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-100 cursor-pointer"
                        >
                          <X className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* footer */}
            {notifications.some((n) => n.isRead) && (
              <div className="px-4 py-2.5 border-t border-[#f0e4d8] shrink-0">
                <button
                  onClick={handleDeleteAllRead}
                  className="flex items-center gap-1.5 text-xs text-[#b09070] hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa tất cả đã đọc
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F0EB] transition-colors cursor-pointer">
        <Settings className="w-5 h-5 text-[#7a6050]" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[#e8d8c8]" />

      {/* User */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => {
            setDropdownOpen((o) => !o);
            setNotifOpen(false);
          }}
          className="flex items-center gap-3 hover:bg-[#F5F0EB] rounded-full pl-2 pr-1 py-1 transition-colors cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#5a3020] leading-tight">
              {user?.name}
            </p>
            {user?.role === "admin" ? (
              <p className="text-[11px] text-[#b09070]">Admin</p>
            ) : (
              <p className="text-[11px] text-[#b09070]">HQ Admin</p>
            )}
          </div>

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#C8714A] shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#C8714A] flex items-center justify-center border-2 border-[#C8714A] shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </button>

        {/* User dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#f0e4d8]">
              <p className="text-sm font-medium text-[#5a3020] truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[#b09070] truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavBar;
