import { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
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
          onClick={() => {
            setNotifOpen((o) => !o);
            setDropdownOpen(false);
          }}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F0EB] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#7a6050]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Notif dropdown */}
        {notifOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#f0e4d8]">
              <p className="text-sm font-semibold text-[#5a3020]">Thông báo</p>
            </div>
            <div className="py-2">
              {[
                { text: "Đơn hàng #1042 vừa được đặt", time: "2 phút trước" },
                { text: "Đặt bàn mới từ Linh Nguyễn", time: "15 phút trước" },
                { text: "5 đánh giá mới hôm nay", time: "1 giờ trước" },
              ].map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 hover:bg-[#fdf8f5] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-[#5a3020]">{n.text}</p>
                  <p className="text-xs text-[#b09070] mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F0EB] transition-colors">
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
          className="flex items-center gap-3 hover:bg-[#F5F0EB] rounded-full pl-2 pr-1 py-1 transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#5a3020] leading-tight">
              {user?.name}
            </p>

            {user?.role == "admin" ? (
              <p className="text-[11px] text-[#b09070]">Admin</p>
            ) : (
              <p className="text-[11px] text-[#b09070]">HQ Admin</p>
            )}
          </div>

          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#C8714A]"
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
                onClick={() => {
                  navigate("/admin/profile");
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7a6050] hover:bg-[#fdf8f5] transition-colors"
              >
                <User className="w-4 h-4 text-[#b09070]" />
                Trang cá nhân
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
