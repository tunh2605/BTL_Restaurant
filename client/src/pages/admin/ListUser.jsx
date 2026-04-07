import { useState, useRef, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Trash2,
  X,
  Mail,
  Calendar,
  User,
  AlertCircle,
  Crown,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/admin/ConfirmModal";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

// ─── Avatar ───────────────────────────────────────────────────────────────────
const UserAvatar = ({ user, size = "md" }) => {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-[#e8d0bc]`}
      />
    );
  }
  const colors = [
    "#C8714A",
    "#f59e0b",
    "#3b82f6",
    "#22c55e",
    "#8b5cf6",
    "#ec4899",
  ];
  const color = colors[(user.name || "U").charCodeAt(0) % colors.length];
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center border-2 border-[#e8d0bc] font-semibold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {(user.name || "U").charAt(0).toUpperCase()}
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const UserDetailModal = ({ user, onClose, onRoleChange, updating }) => {
  if (!user) return null;
  const isAdmin = user.role === "admin";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#ede0d4] shadow-xl w-full max-w-md animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e4d8]">
          <h3 className="font-bold text-[#3a2010] text-base">
            Chi tiết người dùng
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5ede3] text-[#a08060] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Avatar + basic info */}
          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="lg" />
            <div>
              <p className="font-bold text-[#3a2010] text-base">{user.name}</p>
              <p className="text-sm text-[#7a6050] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-purple-50 text-purple-600"
                    : "bg-[#FFF3EE] text-[#C8714A]"
                }`}
              >
                {isAdmin ? (
                  <Crown className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Đặt bàn",
                value: user.reservationCount ?? 0,
                color: "#3b82f6",
              },
              {
                label: "Ngày tham gia",
                value: new Date(user.createdAt).toLocaleDateString("vi-VN"),
                color: "#22c55e",
                small: true,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#fdf8f5] rounded-xl px-3 py-3 text-center"
              >
                <p
                  className={`font-bold text-[#3a2010] ${stat.small ? "text-sm" : "text-xl"}`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#a08060] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Role change */}
          <div className="border-t border-[#f0e4d8] pt-4">
            <p className="text-xs text-[#b09070] mb-2">Đổi vai trò</p>
            <div className="flex gap-2">
              <button
                onClick={() => onRoleChange(user._id, "user")}
                disabled={user.role === "user" || updating}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all ${
                  user.role === "user"
                    ? "bg-[#C8714A] text-white cursor-default"
                    : "border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                } disabled:opacity-50`}
              >
                <User className="w-3.5 h-3.5" />
                User
              </button>
              <button
                onClick={() => onRoleChange(user._id, "admin")}
                disabled={user.role === "admin" || updating}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all ${
                  user.role === "admin"
                    ? "bg-purple-600 text-white cursor-default"
                    : "border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                } disabled:opacity-50`}
              >
                <Crown className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const sortRef = useRef(null);

  // ─── Fetch users ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
      );
      setUsers(data);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const newThisMonth = users.filter((u) => {
    const d = new Date(u.createdAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      if (sortBy === "created_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "created_asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "name_asc")
        return (a.name || "").localeCompare(b.name || "", "vi");
      if (sortBy === "name_desc")
        return (b.name || "").localeCompare(a.name || "", "vi");
      if (sortBy === "reservations_desc")
        return (b.reservationCount || 0) - (a.reservationCount || 0);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleRoleChange = async (id, newRole) => {
    setUpdating(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/role`,
        { role: newRole },
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: data.user.role } : u)),
      );
      setSelectedUser((prev) =>
        prev?._id === id ? { ...prev, role: data.user.role } : prev,
      );
      toast.success("Cập nhật vai trò thành công.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedId}`,
      );
      setUsers((prev) => prev.filter((u) => u._id !== selectedId));
      if (selectedUser?._id === selectedId) setSelectedUser(null);
      toast.success("Đã xoá người dùng.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xoá thất bại.");
    } finally {
      handleCloseConfirm();
    }
  };

  const sortOptions = [
    { value: "created_desc", label: "Mới tham gia nhất" },
    { value: "created_asc", label: "Tham gia cũ nhất" },
    { value: "name_asc", label: "Tên A → Z" },
    { value: "name_desc", label: "Tên Z → A" },
    { value: "reservations_desc", label: "Nhiều đặt bàn nhất" },
  ];

  const roleTabs = [
    { value: "all", label: "Tất cả", count: totalUsers },
    { value: "user", label: "User", count: userCount },
    { value: "admin", label: "Admin", count: adminCount },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-[#a08060] mt-1">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors text-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 text-[#C8714A] ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Tổng người dùng",
            value: totalUsers,
            color: "#C8714A",
            bg: "#FFF3EE",
            icon: Users,
          },
          {
            label: "Người dùng thường",
            value: userCount,
            color: "#3b82f6",
            bg: "#EFF6FF",
            icon: User,
          },
          {
            label: "Quản trị viên",
            value: adminCount,
            color: "#8b5cf6",
            bg: "#F5F3FF",
            icon: Crown,
          },
          {
            label: "Mới tháng này",
            value: newThisMonth,
            color: "#22c55e",
            bg: "#F0FDF4",
            icon: UserCheck,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-[#ede0d4] px-4 py-4 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#3a2010]">
                  {loading ? "—" : card.value}
                </p>
                <p className="text-xs text-[#a08060]">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Table Card ─── */}
      <div className="bg-white rounded-2xl border border-[#ede0d4]">
        {/* Filters bar */}
        <div className="px-5 pt-5 pb-4 border-b border-[#f0e4d8] space-y-3">
          {/* Role tabs */}
          <div className="flex flex-wrap gap-2">
            {roleTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setRoleFilter(tab.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  roleFilter === tab.value
                    ? "bg-[#C8714A] text-white shadow-sm"
                    : "bg-[#F5EDE3] text-[#7a6050] hover:bg-[#ecddd0]"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    roleFilter === tab.value
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#C8714A]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 bg-[#F5F0EB] rounded-xl px-4 py-2 flex-1">
              <Search className="w-4 h-4 text-[#b09070] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm tên, email..."
                className="bg-transparent text-sm outline-none text-[#5a3020] placeholder:text-[#c0a080] w-full"
              />
            </div>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors whitespace-nowrap"
              >
                <ArrowUpDown className="w-4 h-4 text-[#C8714A]" />
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden animate-slideUp w-52">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-[#FFF3EE] text-[#C8714A] font-semibold"
                          : "text-[#7a6050] hover:bg-[#fdf8f5]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0e4d8]">
                {[
                  "Người dùng",
                  "Email",
                  "Vai trò",
                  "Đặt bàn",
                  "Ngày tham gia",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-[#b09070] uppercase tracking-wider py-3 px-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-14 text-[#b09070] text-sm"
                  >
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 text-[#C8714A] animate-spin" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-14 text-[#b09070] text-sm"
                  >
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#e0caba]" />
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                  >
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={u} size="sm" />
                        <div>
                          <p className="font-semibold text-[#3a2010] whitespace-nowrap">
                            {u.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#7a6050] whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#b09070]" />
                        {u.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-[#FFF3EE] text-[#C8714A]"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <Crown className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {u.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#3a2010]">
                      {u.reservationCount ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-[#a08060] whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F5EDE3] text-[#a08060] hover:text-[#C8714A] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#a08060] hover:text-red-500 transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#f0e4d8]">
            <p className="text-xs text-[#b09070]">
              {(currentPage - 1) * PER_PAGE + 1}–
              {Math.min(currentPage * PER_PAGE, filtered.length)} /{" "}
              {filtered.length} người dùng
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 text-xs rounded-xl font-medium transition-colors ${
                    p === currentPage
                      ? "bg-[#C8714A] text-white"
                      : "border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRoleChange={handleRoleChange}
          updating={updating}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Xóa người dùng"
        description="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ListUser;
