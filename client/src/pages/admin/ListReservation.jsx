import { useState, useRef, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Search,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  X,
  Clock,
  User,
  Phone,
  FileText,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/admin/ConfirmModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "bg-red-50 text-red-500 border-red-200",
    dot: "bg-red-400",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Detail / Edit Modal ──────────────────────────────────────────────────────
const ReservationModal = ({
  reservation: res,
  onClose,
  onStatusChange,
  updating,
}) => {
  if (!res) return null;

  const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

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
            Chi tiết đặt bàn
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5ede3] text-[#a08060] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* ID + status */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#a08060] bg-[#f5ede3] px-2.5 py-1 rounded-lg">
              {res._id}
            </span>
            <StatusBadge status={res.status} />
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            {[
              { icon: User, label: "Khách hàng", value: res.name },
              { icon: Phone, label: "Điện thoại", value: res.phone },
              {
                icon: CalendarDays,
                label: "Ngày",
                value: formatDate(res.date),
              },
              { icon: Clock, label: "Giờ", value: res.time },
              {
                icon: User,
                label: "Số người",
                value: `${res.numberOfPeople} người`,
              },
              ...(res.note
                ? [{ icon: FileText, label: "Ghi chú", value: res.note }]
                : []),
              ...(res.user?.name
                ? [
                    {
                      icon: User,
                      label: "Tài khoản",
                      value: `${res.user.name} (${res.user.email})`,
                    },
                  ]
                : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#fdf8f5] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#C8714A]" />
                </div>
                <div>
                  <p className="text-xs text-[#b09070]">{label}</p>
                  <p className="text-sm text-[#3a2010] font-semibold mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Status change */}
          <div className="border-t border-[#f0e4d8] pt-4">
            <p className="text-xs text-[#b09070] mb-2">Cập nhật trạng thái</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const cfg = STATUS_CFG[s];
                const active = res.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => !active && onStatusChange(res._id, s)}
                    disabled={active || updating}
                    className={`text-xs font-semibold py-2 rounded-xl border transition-all ${
                      active
                        ? `${cfg.color} cursor-default`
                        : "border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                    } disabled:opacity-60`}
                  >
                    {updating && !active ? (
                      <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                    ) : (
                      cfg.label
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ListReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const sortRef = useRef(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reservations`,
      );
      setReservations(data);
    } catch {
      toast.error("Không thể tải danh sách đặt bàn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const completed = reservations.filter((r) => r.status === "completed").length;
  const cancelled = reservations.filter((r) => r.status === "cancelled").length;

  // ─── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = reservations
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || r.name?.toLowerCase().includes(q) || r.phone?.includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "created_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "created_asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reservations/${id}/status`,
        { status: newStatus },
      );
      setReservations((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: data.reservation.status } : r,
        ),
      );
      setSelected((prev) =>
        prev?._id === id ? { ...prev, status: data.reservation.status } : prev,
      );
      toast.success("Cập nhật trạng thái thành công.");
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
        `${import.meta.env.VITE_API_URL}/api/reservations/${selectedId}`,
      );
      setReservations((prev) => prev.filter((r) => r._id !== selectedId));
      if (selected?._id === selectedId) setSelected(null);
      toast.success("Đã xoá đặt bàn.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xoá thất bại.");
    } finally {
      handleCloseConfirm();
    }
  };

  const sortOptions = [
    { value: "date_desc", label: "Ngày đặt mới nhất" },
    { value: "date_asc", label: "Ngày đặt cũ nhất" },
    { value: "created_desc", label: "Tạo mới nhất" },
    { value: "created_asc", label: "Tạo cũ nhất" },
  ];

  const statusTabs = [
    { value: "all", label: "Tất cả", count: total },
    { value: "pending", label: "Chờ xác nhận", count: pending },
    { value: "confirmed", label: "Đã xác nhận", count: confirmed },
    { value: "completed", label: "Hoàn thành", count: completed },
    { value: "cancelled", label: "Đã huỷ", count: cancelled },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">
            Quản lý đặt bàn
          </h1>
          <p className="text-sm text-[#a08060] mt-1">
            Xem và cập nhật trạng thái các yêu cầu đặt bàn
          </p>
        </div>
        <button
          onClick={fetchReservations}
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Tổng đặt bàn",
            value: total,
            color: "#C8714A",
            bg: "#FFF3EE",
          },
          {
            label: "Chờ xác nhận",
            value: pending,
            color: "#d97706",
            bg: "#FFFBEB",
          },
          {
            label: "Đã xác nhận",
            value: confirmed,
            color: "#2563eb",
            bg: "#EFF6FF",
          },
          {
            label: "Hoàn thành",
            value: completed,
            color: "#16a34a",
            bg: "#F0FDF4",
          },
          {
            label: "Đã huỷ",
            value: cancelled,
            color: "#dc2626",
            bg: "#FEF2F2",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-[#ede0d4] px-4 py-4 flex items-center gap-3"
          >
            <div
              className="w-3 h-10 rounded-full shrink-0"
              style={{ backgroundColor: card.color }}
            />
            <div>
              <p className="text-xl font-bold text-[#3a2010]">
                {loading ? "—" : card.value}
              </p>
              <p className="text-xs text-[#a08060]">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Table Card ─── */}
      <div className="bg-white rounded-2xl border border-[#ede0d4]">
        {/* Filters */}
        <div className="px-5 pt-5 pb-4 border-b border-[#f0e4d8] space-y-3">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.value
                    ? "bg-[#C8714A] text-white shadow-sm"
                    : "bg-[#F5EDE3] text-[#7a6050] hover:bg-[#ecddd0]"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    statusFilter === tab.value
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
            <div className="flex items-center gap-2 bg-[#F5F0EB] rounded-xl px-4 py-2 flex-1">
              <Search className="w-4 h-4 text-[#b09070] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm tên, số điện thoại..."
                className="bg-transparent text-sm outline-none text-[#5a3020] placeholder:text-[#c0a080] w-full"
              />
            </div>

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
                  "Mã đặt bàn",
                  "Khách hàng",
                  "Ngày · Giờ",
                  "Số người",
                  "Ghi chú",
                  "Trạng thái",
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
                    colSpan={7}
                    className="text-center py-14 text-[#b09070] text-sm"
                  >
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 text-[#C8714A] animate-spin" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-14 text-[#b09070] text-sm"
                  >
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#e0caba]" />
                    Không tìm thấy đặt bàn nào
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-[#a08060] bg-[#f5ede3] px-2 py-0.5 rounded-lg break-all">
                        {r._id}
                      </span>
                    </td>
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#3a2010] whitespace-nowrap">
                        {r.name}
                      </p>
                      <p className="text-xs text-[#a08060] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {r.phone}
                      </p>
                    </td>
                    {/* Date · Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-[#3a2010]">
                        {formatDate(r.date)}
                      </p>
                      <p className="text-xs text-[#a08060] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {r.time}
                      </p>
                    </td>
                    {/* People */}
                    <td className="py-3.5 px-4 text-center font-semibold text-[#3a2010]">
                      {r.numberOfPeople}
                    </td>
                    {/* Note */}
                    <td className="py-3.5 px-4 max-w-40">
                      <p className="text-xs text-[#a08060] truncate italic">
                        {r.note || "—"}
                      </p>
                    </td>
                    {/* Status */}
                    <td
                      className="py-3.5 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(r._id, e.target.value)
                        }
                        disabled={updating}
                        className="text-xs border border-[#e8d8c8] rounded-xl px-2 py-1.5 bg-white text-[#3a2010] cursor-pointer outline-none focus:border-[#C8714A] transition-colors disabled:opacity-50"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã huỷ</option>
                      </select>
                    </td>
                    {/* Actions */}
                    <td
                      className="py-3.5 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#a08060] hover:text-red-500 transition-colors"
                        title="Xoá"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
              {filtered.length} đặt bàn
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
      {selected && (
        <ReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Xóa đặt bàn"
        description="Bạn có chắc chắn muốn xóa đặt bàn này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ListReservation;
