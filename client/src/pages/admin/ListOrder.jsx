import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import {
  ChevronDown,
  Filter,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Chờ xác nhận", color: "bg-amber-50 text-amber-600",   icon: Clock },
  confirmed: { label: "Đã xác nhận",  color: "bg-blue-50 text-blue-600",     icon: CheckCircle2 },
  preparing: { label: "Đang làm",     color: "bg-purple-50 text-purple-600", icon: Clock },
  completed: { label: "Hoàn thành",   color: "bg-green-50 text-green-700",   icon: CheckCircle2 },
  cancelled: { label: "Đã huỷ",       color: "bg-red-50 text-red-500",       icon: XCircle },
};

const STATUS_FLOW = ["pending", "confirmed", "preparing", "completed", "cancelled"];

const METHOD_LABELS = {
  cash:   "Tiền mặt",
  vnpay:  "VNPay",
  online: "Online",
};

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
};

// ─── Status Select Dropdown (portal, fixed positioning) ──────────────────────
const StatusSelect = ({ orderId, current, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click — check against BOTH btn and menu
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inBtn  = btnRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inBtn && !inMenu) setOpen(false);
    };
    // Use capture so it fires before any stopPropagation
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);

  const handleToggle = () => {
    if (loading) return;
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen((o) => !o);
  };

  const handleSelect = async (status) => {
    setOpen(false);
    if (status === current) return;
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status }
      );
      onUpdate(orderId, status);
    } catch {
      alert("Cập nhật trạng thái thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
      >
        {loading
          ? <><RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C8714A]" /><span className="ml-1 text-[#C8714A]">Đang lưu...</span></>
          : <StatusBadge status={current} />
        }
        {!loading && (
          <ChevronDown className={`w-3 h-3 text-[#a08060] transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999, width: 184 }}
          className="bg-white border border-[#ede0d4] rounded-2xl shadow-xl overflow-hidden"
        >
          {STATUS_FLOW.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                onMouseDown={(e) => {
                  // Prevent the outside-click handler from firing first
                  e.stopPropagation();
                  handleSelect(s);
                }}
                className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                  s === current
                    ? "bg-[#FFF3EE] text-[#C8714A] font-semibold"
                    : "text-[#7a6050] hover:bg-[#fdf8f5]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {cfg.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [methodOpen, setMethodOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const methodRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (methodRef.current && !methodRef.current.contains(e.target)) setMethodOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`
      );
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Xóa đơn hàng này?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      alert("Xóa đơn hàng thất bại.");
    }
  };

  const filtered = orders.filter((o) => {
    if (filterMethod !== "all" && o.paymentMethod !== filterMethod) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    return true;
  });

  const methodOptions = [
    { value: "all",   label: "Tất cả" },
    { value: "cash",  label: "Tiền mặt" },
    { value: "vnpay", label: "VNPay" },
  ];

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...STATUS_FLOW.map((s) => ({ value: s, label: STATUS_CONFIG[s].label })),
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">Đơn hàng</h1>
          <p className="text-sm text-[#a08060] mt-1">Quản lý tất cả đơn hàng</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors self-start cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#C8714A] ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Method filter */}
        <div className="relative" ref={methodRef}>
          <button
            onClick={() => { setMethodOpen((o) => !o); setStatusOpen(false); }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#C8714A]" />
            {methodOptions.find((o) => o.value === filterMethod)?.label}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${methodOpen ? "rotate-180" : ""}`} />
          </button>
          {methodOpen && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden w-36">
              {methodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterMethod(opt.value); setMethodOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    filterMethod === opt.value
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

        {/* Status filter */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => { setStatusOpen((o) => !o); setMethodOpen(false); }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#C8714A]" />
            {statusOptions.find((o) => o.value === filterStatus)?.label}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
          </button>
          {statusOpen && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden w-44">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterStatus(opt.value); setStatusOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
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

        <span className="text-sm text-[#a08060] ml-auto">
          {filtered.length} đơn
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ede0d4] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-[#C8714A] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="w-10 h-10 text-[#e0caba]" />
            <p className="text-[#a08060] font-medium">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0e4d8] bg-[#fdf8f5]">
                  {["Mã đơn", "Khách hàng", "Món", "Ngày", "Phương thức", "Tổng tiền", "Trạng thái", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-[#b09070] uppercase tracking-wider px-5 py-3.5 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                  >
                    {/* Mã đơn */}
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-[#C8714A]">
                      {order._id}
                    </td>

                    {/* Khách hàng */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-[#3a2010]">
                        {order.user?.name || "—"}
                      </p>
                      <p className="text-xs text-[#a08060]">
                        {order.user?.email || ""}
                      </p>
                    </td>

                    {/* Món */}
                    <td className="px-5 py-4 text-[#7a6050] max-w-[200px]">
                      {order.items && order.items.length > 0 ? (
                        <span className="truncate block">
                          {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                        </span>
                      ) : (
                        <span className="text-[#c0a890]">—</span>
                      )}
                    </td>

                    {/* Ngày */}
                    <td className="px-5 py-4 text-[#a08060] whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Phương thức */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        order.paymentMethod === "vnpay"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "—"}
                      </span>
                    </td>

                    {/* Tổng tiền */}
                    <td className="px-5 py-4 font-semibold text-[#3a2010] whitespace-nowrap">
                      {formatVND(order.totalPrice)}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-4">
                      <StatusSelect
                        orderId={order._id}
                        current={order.status}
                        onUpdate={handleStatusUpdate}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa đơn hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOrder;
