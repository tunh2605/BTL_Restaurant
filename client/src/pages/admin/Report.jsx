import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, ShoppingBag, Award, RefreshCw } from "lucide-react";

const PIE_COLORS = [
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#C8714A",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const formatVND = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(v);

const formatM = (v) =>
  Math.abs(v) >= 1e6
    ? (v / 1e6).toFixed(1) + "M"
    : Math.abs(v) >= 1e3
      ? (v / 1e3).toFixed(0) + "K"
      : v;

// ── Metric card ───────────────────────────────────────────
const MetricCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-[#ede0d4] px-4 py-4">
    <p className="text-xs text-[#a08060] mb-1">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-[#b09070] mt-1">{sub}</p>}
  </div>
);

// ── Rank badge ────────────────────────────────────────────
const RankBadge = ({ index }) => {
  const styles = [
    "bg-[#FAEEDA] text-[#854F0B]",
    "bg-[#D3D1C7] text-[#444441]",
    "bg-[#F5C4B3] text-[#712B13]",
    "bg-[#f5f5f5] text-[#888780]",
  ];
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${styles[Math.min(index, 3)]}`}
    >
      {index + 1}
    </span>
  );
};

// ── Main ──────────────────────────────────────────────────
const Report = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/foods/stats`,
      );
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-[#C8714A] animate-spin" />
      </div>
    );

  if (!stats)
    return (
      <div className="flex items-center justify-center h-64 text-[#b09070] text-sm">
        Không có dữ liệu
      </div>
    );

  const { topSellingFoods, dailyOrders, categoryStats, totalStats } = stats;
  const rev30 = dailyOrders.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">
            Báo cáo thống kê
          </h1>
          <p className="text-sm text-[#a08060] mt-1">
            Tổng quan hoạt động kinh doanh
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors text-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 text-[#C8714A] ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Tổng đơn hàng"
          value={totalStats.totalOrders.toLocaleString("vi-VN")}
          sub="tất cả thời gian"
          color="text-[#C8714A]"
        />
        <MetricCard
          label="Tổng doanh thu"
          value={formatVND(totalStats.totalRevenue)}
          sub="tất cả thời gian"
          color="text-[#22c55e]"
        />
        <MetricCard
          label="Doanh thu 30 ngày"
          value={formatVND(rev30)}
          sub="gần đây nhất"
          color="text-[#3b82f6]"
        />
        <MetricCard
          label="Món bán chạy nhất"
          value={topSellingFoods[0]?.name.slice(0, 16) || "—"}
          sub={topSellingFoods[0] ? `${topSellingFoods[0].sold} lượt bán` : ""}
          color="text-[#8b5cf6]"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line chart */}
        <div className="bg-white rounded-2xl border border-[#ede0d4] p-5">
          <p className="text-sm font-semibold text-[#3a2010] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C8714A]" />
            Doanh thu 30 ngày gần đây
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={dailyOrders}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e4d8" />
              <XAxis
                dataKey="_id"
                stroke="#b09070"
                fontSize={10}
                tickFormatter={(v) => v.slice(5)}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#b09070"
                fontSize={10}
                tickFormatter={formatM}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip
                formatter={(v) => [formatVND(v), "Doanh thu"]}
                contentStyle={{
                  borderRadius: 10,
                  border: "0.5px solid #ede0d4",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#C8714A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#C8714A" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-[#ede0d4] p-5">
          <p className="text-sm font-semibold text-[#3a2010] mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#534AB7]" />
            Tỉ lệ theo danh mục
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {categoryStats.map((c, i) => (
              <span
                key={c._id}
                className="flex items-center gap-1.5 text-xs text-[#7a6050]"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {c._id}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="totalSold"
                nameKey="_id"
                paddingAngle={2}
              >
                {categoryStats.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, _, p) => [`${v} đã bán`, p.payload._id]}
                contentStyle={{
                  borderRadius: 10,
                  border: "0.5px solid #ede0d4",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking table */}
      <div className="bg-white rounded-2xl border border-[#ede0d4]">
        <div className="px-5 py-4 border-b border-[#f0e4d8]">
          <p className="text-sm font-semibold text-[#3a2010] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#3B6D11]" />
            Bảng xếp hạng món ăn
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0e4d8]">
                {["#", "Món ăn", "Danh mục", "Đã bán", "Doanh thu"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`py-3 px-4 text-xs font-semibold text-[#b09070] uppercase tracking-wider whitespace-nowrap ${i > 2 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {topSellingFoods.map((food, i) => (
                <tr
                  key={food._id}
                  className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                >
                  <td className="py-3 px-4">
                    <RankBadge index={i} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {food.image ? (
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-9 h-9 rounded-xl object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#f5ede3] flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-[#C8714A]" />
                        </div>
                      )}
                      <span className="font-medium text-[#3a2010]">
                        {food.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#F5EDE3] text-[#C8714A] font-medium">
                      {food.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#C8714A]">
                    {food.sold}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#22c55e]">
                    {formatVND(food.price * food.sold)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
