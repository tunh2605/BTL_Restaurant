import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ChevronDown,
  Filter,
  Trash2,
  RefreshCw,
  AlertCircle,
  Plus,
  Tag,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Calendar,
  Percent,
  BadgeDollarSign,
} from "lucide-react";
import { formatVND } from "../../libs/formatVND";
import { formatDate } from "../../libs/formatDate";
import PromotionModal from "../../components/admin/PromotionModal";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/admin/ConfirmModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isExpired = (p) => p.endDate && new Date() > new Date(p.endDate);
const isNotStarted = (p) => p.startDate && new Date() < new Date(p.startDate);

// ─── Config ───────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  order: { label: "Đơn hàng", color: "bg-blue-50 text-blue-600" },
  food: { label: "Món ăn", color: "bg-purple-50 text-purple-600" },
};

const DISCOUNT_TYPE_CONFIG = {
  percent: { label: "Phần trăm", icon: Percent },
  fixed: { label: "Cố định", icon: BadgeDollarSign },
};

const getStatusInfo = (p) => {
  if (!p.isActive)
    return { label: "Tạm dừng", color: "bg-gray-100 text-gray-500" };
  if (isExpired(p))
    return { label: "Hết hạn", color: "bg-red-50 text-red-500" };
  if (isNotStarted(p))
    return { label: "Chưa bắt đầu", color: "bg-amber-50 text-amber-600" };
  return { label: "Đang hoạt động", color: "bg-green-50 text-green-700" };
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ promotion }) => {
  const { label, color } = getStatusInfo(promotion);
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${color}`}
    >
      {label}
    </span>
  );
};

// ─── Simple Dropdown ──────────────────────────────────────────────────────────
const Dropdown = ({
  triggerRef,
  open,
  options,
  value,
  onChange,
  onClose,
  width = "w-44",
}) => {
  if (!open) return null;
  return (
    <div
      className={`absolute left-0 top-[calc(100%+6px)] z-50 bg-white border border-[#ede0d4] rounded-2xl shadow-md overflow-hidden ${width}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            onChange(opt.value);
            onClose();
          }}
          className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
            value === opt.value
              ? "bg-[#FFF3EE] text-[#C8714A] font-semibold"
              : "text-[#7a6050] hover:bg-[#fdf8f5]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ListPromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const typeRef = useRef(null);
  const statusRef = useRef(null);
  const [modalPromotion, setModalPromotion] = useState(undefined); // undefined=closed, null=add, obj=edit

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target))
        setTypeOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target))
        setStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/promotions`,
      );
      setPromotions(data.data || []);
    } catch {
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleToggleActive = async (p) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/promotions/update/${p._id}`,
        {
          isActive: !p.isActive,
        },
      );
      setPromotions((prev) =>
        prev.map((x) =>
          x._id === p._id ? { ...x, isActive: !x.isActive } : x,
        ),
      );
    } catch {
      alert("Cập nhật thất bại.");
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

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/promotions/delete/${selectedId}`,
      );

      setPromotions((prev) => prev.filter((p) => p._id !== selectedId));

      toast.success("Xóa thành công.");
    } catch {
      toast.error("Xóa thất bại.");
    } finally {
      setSelectedId(null);
    }
  };

  const filtered = promotions.filter((p) => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterStatus !== "all") {
      const { label } = getStatusInfo(p);
      const map = {
        active: "Đang hoạt động",
        inactive: "Tạm dừng",
        expired: "Hết hạn",
        upcoming: "Chưa bắt đầu",
      };
      if (label !== map[filterStatus]) return false;
    }
    return true;
  });

  const typeOptions = [
    { value: "all", label: "Tất cả loại" },
    { value: "order", label: "Đơn hàng" },
    { value: "food", label: "Món ăn" },
  ];

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Tạm dừng" },
    { value: "expired", label: "Hết hạn" },
    { value: "upcoming", label: "Chưa bắt đầu" },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3a2010]">
            Khuyến mãi
          </h1>
          <p className="text-sm text-[#a08060] mt-1">
            Quản lý tất cả chương trình khuyến mãi
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <button
            onClick={fetchPromotions}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#C8714A] ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
          <button
            onClick={() => setModalPromotion(null)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-[#C8714A] text-white hover:bg-[#b5623e] transition-colors cursor-pointer font-semibold"
          >
            <Plus className="w-4 h-4" />
            Thêm khuyến mãi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter */}
        <div className="relative" ref={typeRef}>
          <button
            onClick={() => {
              setTypeOpen((o) => !o);
              setStatusOpen(false);
            }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#C8714A]" />
            {typeOptions.find((o) => o.value === filterType)?.label}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${typeOpen ? "rotate-180" : ""}`}
            />
          </button>
          <Dropdown
            open={typeOpen}
            value={filterType}
            options={typeOptions}
            onChange={setFilterType}
            onClose={() => setTypeOpen(false)}
            width="w-36"
          />
        </div>

        {/* Status filter */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => {
              setStatusOpen((o) => !o);
              setTypeOpen(false);
            }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-[#e8d8c8] bg-white text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 text-[#C8714A]" />
            {statusOptions.find((o) => o.value === filterStatus)?.label}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`}
            />
          </button>
          <Dropdown
            open={statusOpen}
            value={filterStatus}
            options={statusOptions}
            onChange={setFilterStatus}
            onClose={() => setStatusOpen(false)}
            width="w-48"
          />
        </div>

        <span className="text-sm text-[#a08060] ml-auto">
          {filtered.length} khuyến mãi
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
            <p className="text-[#a08060] font-medium">
              Không có khuyến mãi nào
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0e4d8] bg-[#fdf8f5]">
                  {[
                    "Tên KM",
                    "Loại",
                    "Giảm giá",
                    "Thời gian",
                    "Lượt dùng",
                    "Đơn tối thiểu",
                    "Trạng thái",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[#b09070] uppercase tracking-wider px-5 py-3.5 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const DiscountIcon =
                    DISCOUNT_TYPE_CONFIG[p.discountType]?.icon || Tag;
                  return (
                    <tr
                      key={p._id}
                      className="border-b border-[#f9f2ec] hover:bg-[#fdf8f5] transition-colors"
                    >
                      {/* Tên */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#FFF3EE] flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4 text-[#C8714A]" />
                          </div>
                          <span className="font-semibold text-[#3a2010] whitespace-nowrap">
                            {p.name}
                          </span>
                        </div>
                      </td>

                      {/* Loại */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_CONFIG[p.type]?.color || "bg-gray-100 text-gray-500"}`}
                        >
                          {TYPE_CONFIG[p.type]?.label || p.type}
                        </span>
                      </td>

                      {/* Giảm giá */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#C8714A] font-semibold">
                          <DiscountIcon className="w-3.5 h-3.5" />
                          {p.discountType === "percent"
                            ? `${p.discountValue}%`
                            : formatVND(p.discountValue)}
                        </div>
                        {p.maxDiscount && (
                          <p className="text-xs text-[#a08060] mt-0.5">
                            Tối đa {formatVND(p.maxDiscount)}
                          </p>
                        )}
                      </td>

                      {/* Thời gian */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-[#7a6050]">
                          <Calendar className="w-3.5 h-3.5 text-[#C8714A]" />
                          {formatDate(p.startDate)} — {formatDate(p.endDate)}
                        </div>
                      </td>

                      {/* Lượt dùng */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[#3a2010] font-semibold">
                          {p.usedCount ?? 0}
                        </span>
                        {p.usageLimit && (
                          <span className="text-[#a08060]">
                            {" "}
                            / {p.usageLimit}
                          </span>
                        )}
                      </td>

                      {/* Đơn tối thiểu */}
                      <td className="px-5 py-4 whitespace-nowrap text-[#7a6050]">
                        {p.minOrderValue ? formatVND(p.minOrderValue) : "—"}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-4">
                        <StatusBadge promotion={p} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Toggle active */}
                          <button
                            onClick={() => handleToggleActive(p)}
                            title={p.isActive ? "Tạm dừng" : "Kích hoạt"}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#FFF3EE] text-[#C8714A] hover:bg-[#ffe0cc] transition-colors cursor-pointer"
                          >
                            {p.isActive ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => setModalPromotion(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalPromotion !== undefined && (
        <PromotionModal
          promotion={modalPromotion}
          onClose={() => setModalPromotion(undefined)}
          onSaved={fetchPromotions}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={confirmDelete}
        title="Xóa khuyến mãi"
        description="Bạn có chắc chắn muốn xóa khuyến mãi này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ListPromotion;
