import { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  CalendarCheck,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const revenueData = [
  { week: "Tuần 1", revenue: 18500000, orders: 42 },
  { week: "Tuần 2", revenue: 24300000, orders: 58 },
  { week: "Tuần 3", revenue: 21700000, orders: 51 },
  { week: "Tuần 4", revenue: 31200000, orders: 74 },
];

const prevMonthRevenueData = [
  { week: "Tuần 1", revenue: 15200000, orders: 36 },
  { week: "Tuần 2", revenue: 19800000, orders: 47 },
  { week: "Tuần 3", revenue: 22100000, orders: 53 },
  { week: "Tuần 4", revenue: 27400000, orders: 65 },
];

const orderStatusData = [
  { name: "Hoàn thành", value: 186, color: "#22c55e" },
  { name: "Đang xử lý", value: 43, color: "#f59e0b" },
  { name: "Đã huỷ", value: 21, color: "#ef4444" },
  { name: "Chờ xác nhận", value: 12, color: "#C8714A" },
];



// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const formatVNDShort = (amount) => {
  if (amount >= 1_000_000_000)
    return `${(amount / 1_000_000_000).toFixed(1)}B ₫`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ₫`;
  return `${amount} ₫`;
};

const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
const prevTotalRevenue = prevMonthRevenueData.reduce(
  (s, d) => s + d.revenue,
  0
);
const revenueChange = (
  ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) *
  100
).toFixed(1);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#ede0d4] rounded-2xl px-4 py-3 shadow-md">
      <p className="text-xs font-semibold text-[#b09070] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatVNDShort(entry.value)}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-[#ede0d4] rounded-2xl px-4 py-3 shadow-md">
      <p className="text-sm font-semibold text-[#5a3020]">{name}</p>
      <p className="text-sm text-[#7a6050]">{value} đơn</p>
    </div>
  );
};

// ─── DateRangePicker ─────────────────────────────────────────────────────────
const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [open, setOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate || "");
  const [localEnd, setLocalEnd] = useState(endDate || "");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const apply = () => {
    onChange(localStart, localEnd);
    setOpen(false);
  };

  const label =
    startDate && endDate
      ? `${startDate} → ${endDate}`
      : startDate
      ? `Từ ${startDate}`
      : "Chọn thời gian";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors"
      >
        <Calendar className="w-4 h-4 text-[#C8714A]" />
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md p-4 w-64 animate-slideUp">
          <p className="text-xs font-semibold text-[#b09070] uppercase tracking-wider mb-3">
            Khoảng thời gian
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#7a6050] mb-1 block">Ngày bắt đầu</label>
              <input
                type="date"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                className="w-full text-sm border border-[#e8d8c8] rounded-xl px-3 py-2 outline-none focus:border-[#C8714A] text-[#5a3020]"
              />
            </div>
            <div>
              <label className="text-xs text-[#7a6050] mb-1 block">Ngày kết thúc</label>
              <input
                type="date"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                className="w-full text-sm border border-[#e8d8c8] rounded-xl px-3 py-2 outline-none focus:border-[#C8714A] text-[#5a3020]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setLocalStart("");
                  setLocalEnd("");
                  onChange("", "");
                  setOpen(false);
                }}
                className="flex-1 text-xs py-2 rounded-xl border border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5] transition-colors"
              >
                Xoá lọc
              </button>
              <button
                onClick={apply}
                className="flex-1 text-xs py-2 rounded-xl bg-[#C8714A] text-white font-semibold hover:bg-[#b5603c] transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [periodTab, setPeriodTab] = useState("monthly");
  const [sortBy, setSortBy] = useState("date_desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // ─── Real stats for users + reservations ──────────────────────────────────
  const [dashStats, setDashStats] = useState(null);

  // ─── Real payments ────────────────────────────────────────────────────────
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`
        );
        setDashStats(data);
      } catch {
        // silently fail
      }
    };
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payments`
        );
        setPayments(data);
      } catch {
        // silently fail
      }
    };
    fetchStats();
    fetchPayments();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter payments — map API shape to table shape on the fly
  const filteredPayments = payments
    .map((p) => ({
      id: p._id,
      customer: p.user?.name || p.user?.email || "—",
      date: (p.paidAt || p.createdAt || "").slice(0, 10),
      amount: p.amount,
      method: p.method === "vnpay" ? "online" : p.method,
      status: p.status === "success" ? "completed" : p.status === "failed" ? "cancelled" : p.status,
      items: p.order?.note || "—",
    }))
    .filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (dateRange.start && p.date < dateRange.start) return false;
      if (dateRange.end && p.date > dateRange.end) return false;
      if (periodTab === "today") {
        const today = new Date().toISOString().split("T")[0];
        return p.date === today;
      }
      if (periodTab === "weekly") {
        const oneWeekAgo = new Date(Date.now() - 7 * 86400000)
          .toISOString()
          .split("T")[0];
        return p.date >= oneWeekAgo;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return b.date.localeCompare(a.date);
      if (sortBy === "date_asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });

  const sortOptions = [
    { value: "date_desc", label: "Mới nhất" },
    { value: "date_asc", label: "Cũ nhất" },
    { value: "amount_desc", label: "Số tiền cao nhất" },
    { value: "amount_asc", label: "Số tiền thấp nhất" },
  ];

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã huỷ" },
  ];

  const periodTabs = [
    { value: "monthly", label: "Tháng" },
    { value: "weekly", label: "Tuần" },
    { value: "today", label: "Hôm nay" },
  ];

  const totalCurrentRevenue = dashStats?.revenueThisMonth ?? revenueData.reduce((s, d) => s + d.revenue, 0);
  const prevCurrentRevenue  = dashStats?.revenueLastMonth  ?? prevMonthRevenueData.reduce((s, d) => s + d.revenue, 0);
  const currentRevenueChange = prevCurrentRevenue > 0
    ? (((totalCurrentRevenue - prevCurrentRevenue) / prevCurrentRevenue) * 100).toFixed(1)
    : totalCurrentRevenue > 0 ? "100.0" : "0.0";

  // Pie data từ real API nếu có
  const pieData = dashStats?.orderStatusMap
    ? [
        { name: "Hoàn thành",   value: dashStats.orderStatusMap.completed  || 0, color: "#22c55e" },
        { name: "Đang xử lý",   value: dashStats.orderStatusMap.preparing  || 0, color: "#f59e0b" },
        { name: "Đã xác nhận",  value: dashStats.orderStatusMap.confirmed  || 0, color: "#3b82f6" },
        { name: "Chờ xác nhận", value: dashStats.orderStatusMap.pending    || 0, color: "#C8714A" },
        { name: "Đã huỷ",       value: dashStats.orderStatusMap.cancelled  || 0, color: "#ef4444" },
      ].filter((d) => d.value > 0)
    : orderStatusData;

  const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

  // Helper tính % change
  const pctChange = (curr, prev) => {
    if (prev > 0) return `${curr - prev >= 0 ? "+" : ""}${(((curr - prev) / prev) * 100).toFixed(1)}%`;
    return curr > 0 ? "+100%" : "0%";
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">Dashboard</h1>
        <p className="text-sm text-[#a08060] mt-1">
          Tổng quan hoạt động kinh doanh DoMasala
        </p>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Tổng đơn đã đặt",
            value: dashStats ? String(dashStats.totalOrders) : "—",
            change: dashStats ? pctChange(dashStats.ordersThisMonth, dashStats.ordersLastMonth) : "—",
            up: dashStats ? dashStats.ordersThisMonth >= dashStats.ordersLastMonth : true,
            icon: ShoppingBag,
            color: "#C8714A",
            bg: "#FFF3EE",
          },
          {
            label: "Bàn đã đặt",
            value: dashStats ? String(dashStats.totalReservations) : "—",
            change: dashStats ? pctChange(dashStats.reservationsThisMonth, dashStats.reservationsLastMonth) : "—",
            up: dashStats ? dashStats.reservationsThisMonth >= dashStats.reservationsLastMonth : true,
            icon: CalendarCheck,
            color: "#f59e0b",
            bg: "#FFFBEB",
          },
          {
            label: "Tổng người dùng",
            value: dashStats ? String(dashStats.totalUsers) : "—",
            change: dashStats ? pctChange(dashStats.newUsersThisMonth, dashStats.newUsersLastMonth) : "—",
            up: dashStats ? dashStats.newUsersThisMonth >= dashStats.newUsersLastMonth : true,
            icon: Users,
            color: "#3b82f6",
            bg: "#EFF6FF",
          },
          {
            label: "Tổng doanh thu",
            value: dashStats ? formatVNDShort(dashStats.totalRevenue) : "—",
            change: dashStats ? pctChange(dashStats.revenueThisMonth, dashStats.revenueLastMonth) : "—",
            up: dashStats ? dashStats.revenueThisMonth >= dashStats.revenueLastMonth : true,
            icon: DollarSign,
            color: "#22c55e",
            bg: "#F0FDF4",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-[#ede0d4] px-5 py-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#a08060]">{card.label}</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#3a2010]">{card.value}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    card.up
                      ? "text-green-700 bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {card.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {card.change}
                </span>
                <span className="text-xs text-[#b09070]">so với tháng trước</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line Chart - Revenue */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#ede0d4] p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-[#3a2010]">
                Doanh thu tháng này
              </h2>
              <p className="text-sm text-[#a08060] mt-0.5">
                So sánh theo tuần với tháng trước
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xl font-bold text-[#3a2010]">
                {formatVNDShort(totalCurrentRevenue)}
              </p>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  parseFloat(currentRevenueChange) >= 0
                    ? "text-green-700 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {parseFloat(currentRevenueChange) >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {parseFloat(currentRevenueChange) > 0 ? "+" : ""}
                {currentRevenueChange}%
                {prevCurrentRevenue > 0 && ` (${formatVNDShort(totalCurrentRevenue - prevCurrentRevenue)})`}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={revenueData.map((d, i) => ({
                ...d,
                prevRevenue: prevMonthRevenueData[i]?.revenue,
              }))}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e4d8" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#b09070", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatVNDShort}
                tick={{ fill: "#b09070", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Tháng này"
                stroke="#C8714A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#C8714A", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="prevRevenue"
                name="Tháng trước"
                stroke="#e0caba"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3, fill: "#e0caba", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-[#7a6050]">
              <span className="w-5 h-0.5 bg-[#C8714A] inline-block rounded" />
              Tháng này
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#a08060]">
              <span className="w-5 h-0.5 bg-[#e0caba] inline-block rounded border-dashed" />
              Tháng trước
            </span>
          </div>
        </div>

        {/* Pie Chart - Order Status */}
        <div className="bg-white rounded-2xl border border-[#ede0d4] p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#3a2010]">
              Trạng thái đơn hàng
            </h2>
            <p className="text-sm text-[#a08060] mt-0.5">Phân bổ theo trạng thái</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend */}
          <div className="space-y-2 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-[#7a6050]">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#3a2010]">
                    {entry.value}
                  </span>
                  <span className="text-xs text-[#b09070]">
                    ({pieTotal > 0 ? Math.round((entry.value / pieTotal) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Payment History ─── */}
      <div className="bg-white rounded-2xl border border-[#ede0d4] p-5">
        {/* Table header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-[#3a2010]">
              Lịch sử thanh toán
            </h2>
            <p className="text-sm text-[#a08060] mt-0.5">
              {filteredPayments.length} giao dịch
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period tabs */}
            <div className="flex bg-[#F5EDE3] rounded-xl p-1 gap-1">
              {periodTabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setPeriodTab(t.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    periodTab === t.value
                      ? "bg-white text-[#C8714A] shadow-sm"
                      : "text-[#a08060] hover:text-[#7a6050]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sort by */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-[#C8714A]" />
                <span className="hidden sm:inline">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden animate-slideUp w-44">
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

            {/* Filter by status */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors"
              >
                <Filter className="w-4 h-4 text-[#C8714A]" />
                <span className="hidden sm:inline">
                  {filterOptions.find((o) => o.value === filterStatus)?.label}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden animate-slideUp w-40">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilterStatus(opt.value);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        filterStatus === opt.value
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

            {/* Date range picker */}
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={(start, end) => setDateRange({ start, end })}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0e4d8]">
                {["Mã đơn", "Khách hàng", "Món", "Ngày", "Phương thức", "Số tiền", "Trạng thái"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[#b09070] uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-[#b09070] text-sm"
                  >
                    Không có giao dịch nào trong khoảng thời gian này
                  </td>
                </tr>
              ) : (
                filteredPayments.slice(0, 5).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-mono text-xs font-semibold text-[#C8714A]">
                      {p.id}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-[#3a2010] whitespace-nowrap">
                      {p.customer}
                    </td>
                    <td className="py-3.5 pr-4 text-[#7a6050] max-w-[180px] truncate">
                      {p.items}
                    </td>
                    <td className="py-3.5 pr-4 text-[#a08060] whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          p.method === "online"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.method === "online" ? "Online" : "Tiền mặt"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-[#3a2010] whitespace-nowrap">
                      {formatVND(p.amount)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit whitespace-nowrap ${
                          p.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {p.status === "completed" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {p.status === "completed" ? "Hoàn thành" : "Đã huỷ"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 5 && (
          <p className="text-center text-xs text-[#b09070] mt-4">
            Hiển thị 5 / {filteredPayments.length} giao dịch
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
