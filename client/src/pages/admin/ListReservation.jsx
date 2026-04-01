import { useState, useRef, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Phone,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  FileText,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockReservations = [
  {
    id: "RES-001",
    user: "Nguyễn Văn An",
    phone: "0901234567",
    date: "2024-03-30",
    time: "18:00",
    numberOfPeople: 4,
    status: "confirmed",
    note: "Bàn gần cửa sổ, kỷ niệm sinh nhật",
    createdAt: "2024-03-28",
  },
  {
    id: "RES-002",
    user: "Trần Thị Bích",
    phone: "0912345678",
    date: "2024-03-30",
    time: "19:30",
    numberOfPeople: 2,
    status: "pending",
    note: "",
    createdAt: "2024-03-28",
  },
  {
    id: "RES-003",
    user: "Lê Minh Khoa",
    phone: "0923456789",
    date: "2024-03-31",
    time: "12:00",
    numberOfPeople: 6,
    status: "completed",
    note: "Cần thêm ghế cho trẻ em",
    createdAt: "2024-03-27",
  },
  {
    id: "RES-004",
    user: "Phạm Thu Hà",
    phone: "0934567890",
    date: "2024-04-01",
    time: "20:00",
    numberOfPeople: 3,
    status: "cancelled",
    note: "Đổi ngày không được",
    createdAt: "2024-03-27",
  },
  {
    id: "RES-005",
    user: "Hoàng Đức Minh",
    phone: "0945678901",
    date: "2024-04-02",
    time: "18:30",
    numberOfPeople: 8,
    status: "confirmed",
    note: "Đặt tiệc công ty",
    createdAt: "2024-03-26",
  },
  {
    id: "RES-006",
    user: "Vũ Thị Lan",
    phone: "0956789012",
    date: "2024-04-03",
    time: "11:30",
    numberOfPeople: 2,
    status: "pending",
    note: "",
    createdAt: "2024-03-26",
  },
  {
    id: "RES-007",
    user: "Đỗ Quang Huy",
    phone: "0967890123",
    date: "2024-04-04",
    time: "19:00",
    numberOfPeople: 5,
    status: "confirmed",
    note: "Ăn chay, không dùng hành",
    createdAt: "2024-03-25",
  },
  {
    id: "RES-008",
    user: "Bùi Thị Mai",
    phone: "0978901234",
    date: "2024-04-05",
    time: "12:30",
    numberOfPeople: 4,
    status: "pending",
    note: "",
    createdAt: "2024-03-25",
  },
  {
    id: "RES-009",
    user: "Ngô Thanh Tùng",
    phone: "0989012345",
    date: "2024-04-06",
    time: "18:00",
    numberOfPeople: 2,
    status: "completed",
    note: "Kỷ niệm ngày cưới",
    createdAt: "2024-03-24",
  },
  {
    id: "RES-010",
    user: "Đinh Thu Nga",
    phone: "0990123456",
    date: "2024-04-07",
    time: "20:30",
    numberOfPeople: 10,
    status: "confirmed",
    note: "Đặt phòng riêng",
    createdAt: "2024-03-24",
  },
  {
    id: "RES-011",
    user: "Lý Hồng Nhung",
    phone: "0901234568",
    date: "2024-04-08",
    time: "19:00",
    numberOfPeople: 3,
    status: "cancelled",
    note: "Bận đột xuất",
    createdAt: "2024-03-23",
  },
  {
    id: "RES-012",
    user: "Trương Minh Tuấn",
    phone: "0912345679",
    date: "2024-04-09",
    time: "18:30",
    numberOfPeople: 6,
    status: "pending",
    note: "Có người ăn chay",
    createdAt: "2024-03-23",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
    icon: CheckCircle2,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-50 text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã huỷ",
    color: "bg-red-50 text-red-500",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const statusCounts = (list) =>
  Object.keys(STATUS_CONFIG).reduce((acc, k) => {
    acc[k] = list.filter((r) => r.status === k).length;
    return acc;
  }, {});

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ reservation, onClose, onStatusChange }) => {
  if (!reservation) return null;
  const cfg = STATUS_CONFIG[reservation.status];
  const Icon = cfg.icon;

  const nextStatuses = Object.keys(STATUS_CONFIG).filter(
    (s) => s !== reservation.status
  );

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
          <div>
            <h3 className="font-bold text-[#3a2010] text-base">
              Chi tiết đặt bàn
            </h3>
            <p className="text-xs text-[#b09070] mt-0.5 font-mono">
              {reservation.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5ede3] text-[#a08060] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#b09070] mb-1">Khách hàng</p>
              <p className="font-semibold text-[#3a2010] text-sm">
                {reservation.user}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b09070] mb-1">Điện thoại</p>
              <p className="font-medium text-[#3a2010] text-sm flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#C8714A]" />
                {reservation.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b09070] mb-1">Ngày</p>
              <p className="font-medium text-[#3a2010] text-sm flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#C8714A]" />
                {new Date(reservation.date).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b09070] mb-1">Giờ</p>
              <p className="font-medium text-[#3a2010] text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C8714A]" />
                {reservation.time}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b09070] mb-1">Số người</p>
              <p className="font-medium text-[#3a2010] text-sm flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#C8714A]" />
                {reservation.numberOfPeople} người
              </p>
            </div>
            <div>
              <p className="text-xs text-[#b09070] mb-1">Ngày đặt</p>
              <p className="font-medium text-[#7a6050] text-sm">
                {new Date(reservation.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {reservation.note && (
            <div className="bg-[#fdf8f5] rounded-xl px-4 py-3">
              <p className="text-xs text-[#b09070] mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Ghi chú
              </p>
              <p className="text-sm text-[#5a3020]">{reservation.note}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs text-[#b09070] mb-2">Trạng thái hiện tại</p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </span>
          </div>

          {/* Change status */}
          <div>
            <p className="text-xs text-[#b09070] mb-2">Đổi trạng thái</p>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(reservation.id, s)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:opacity-80 ${c.color} border-current/20`}
                  >
                    {c.label}
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
  const [reservations, setReservations] = useState(mockReservations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const counts = statusCounts(reservations);
  const totalAll = reservations.length;

  const filtered = reservations
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.user.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc")
        return (
          new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
        );
      if (sortBy === "date_asc")
        return (
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
        );
      if (sortBy === "people_desc") return b.numberOfPeople - a.numberOfPeople;
      if (sortBy === "people_asc") return a.numberOfPeople - b.numberOfPeople;
      if (sortBy === "created_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleStatusChange = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setSelectedRes((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
  };

  const handleDelete = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const sortOptions = [
    { value: "date_desc", label: "Ngày đặt mới nhất" },
    { value: "date_asc", label: "Ngày đặt sớm nhất" },
    { value: "people_desc", label: "Nhiều người nhất" },
    { value: "people_asc", label: "Ít người nhất" },
    { value: "created_desc", label: "Mới tạo nhất" },
  ];

  const statusTabs = [
    { value: "all", label: "Tất cả", count: totalAll },
    { value: "pending", label: "Chờ xác nhận", count: counts.pending },
    { value: "confirmed", label: "Đã xác nhận", count: counts.confirmed },
    { value: "completed", label: "Hoàn thành", count: counts.completed },
    { value: "cancelled", label: "Đã huỷ", count: counts.cancelled },
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
            Theo dõi và quản lý các lịch đặt bàn của nhà hàng
          </p>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Tổng đặt bàn",
            value: totalAll,
            color: "#C8714A",
            bg: "#FFF3EE",
            icon: CalendarCheck,
          },
          {
            label: "Chờ xác nhận",
            value: counts.pending,
            color: "#f59e0b",
            bg: "#FFFBEB",
            icon: Clock,
          },
          {
            label: "Đã xác nhận",
            value: counts.confirmed,
            color: "#3b82f6",
            bg: "#EFF6FF",
            icon: CheckCircle2,
          },
          {
            label: "Hoàn thành",
            value: counts.completed,
            color: "#22c55e",
            bg: "#F0FDF4",
            icon: CheckCircle2,
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
                <p className="text-xl font-bold text-[#3a2010]">{card.value}</p>
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

          {/* Search + sort/filter */}
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
                placeholder="Tìm khách hàng, SĐT, mã đặt bàn..."
                className="bg-transparent text-sm outline-none text-[#5a3020] placeholder:text-[#c0a080] w-full"
              />
            </div>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors whitespace-nowrap"
              >
                <ArrowUpDown className="w-4 h-4 text-[#C8714A]" />
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
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
                  "Mã đặt",
                  "Khách hàng",
                  "Liên hệ",
                  "Ngày & Giờ",
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-14 text-[#b09070] text-sm"
                  >
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#e0caba]" />
                    Không tìm thấy đặt bàn nào
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const cfg = STATUS_CONFIG[r.status];
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#C8714A] whitespace-nowrap text-xs">
                        {r.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#3a2010] whitespace-nowrap">
                        {r.user}
                      </td>
                      <td className="py-3.5 px-4 text-[#7a6050] whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#b09070]" />
                          {r.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-[#3a2010]">
                          {new Date(r.date).toLocaleDateString("vi-VN")}
                        </p>
                        <p className="text-xs text-[#b09070]">{r.time}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[#5a3020]">
                          <Users className="w-3.5 h-3.5 text-[#b09070]" />
                          {r.numberOfPeople}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#7a6050] max-w-[140px] truncate">
                        {r.note || (
                          <span className="text-[#c0a080] italic text-xs">
                            Không có
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedRes(r)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F5EDE3] text-[#a08060] hover:text-[#C8714A] transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#a08060] hover:text-red-500 transition-colors"
                            title="Xoá"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              {filtered.length} kết quả
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
      {selectedRes && (
        <DetailModal
          reservation={selectedRes}
          onClose={() => setSelectedRes(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ListReservation;
