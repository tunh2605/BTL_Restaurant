import {
  AlertCircle,
  BadgeDollarSign,
  Check,
  Percent,
  RefreshCw,
  ToggleRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFood } from "../../context/FoodContext";
import { createPortal } from "react-dom";
import axios from "axios";

const EMPTY_FORM = {
  name: "",
  type: "order",
  discountType: "percent",
  discountValue: "",
  startDate: "",
  endDate: "",
  isActive: true,
  minOrderValue: "",
  maxDiscount: "",
  usageLimit: "",
};

const TYPE_CONFIG = {
  order: { label: "Đơn hàng", color: "bg-blue-50 text-blue-600" },
  food: { label: "Món ăn", color: "bg-purple-50 text-purple-600" },
};

const DISCOUNT_TYPE_CONFIG = {
  percent: { label: "Phần trăm", icon: Percent },
  fixed: { label: "Cố định", icon: BadgeDollarSign },
};

const PromotionModal = ({ promotion, onClose, onSaved }) => {
  const [form, setForm] = useState(
    promotion
      ? {
          name: promotion.name,
          type: promotion.type,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          startDate: promotion.startDate
            ? promotion.startDate.slice(0, 10)
            : "",
          endDate: promotion.endDate ? promotion.endDate.slice(0, 10) : "",
          isActive: promotion.isActive,
          minOrderValue: promotion.minOrderValue || "",
          maxDiscount: promotion.maxDiscount || "",
          usageLimit: promotion.usageLimit || "",
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [restaurantIds, setRestaurantIds] = useState(
    promotion?.restaurants?.map((r) => r._id || r) || [],
  );
  const { foods, restaurants } = useFood();

  useEffect(() => {
    if (promotion && promotion.type === "food") {
      setSelectedFoods(promotion.foods?.map((f) => f.food._id) || []);
    }
  }, [promotion]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!restaurantIds.length)
      return setError("Vui lòng chọn ít nhất 1 nhà hàng");
    if (!form.name.trim()) return setError("Vui lòng nhập tên khuyến mãi");
    if (form.type === "food" && selectedFoods.length === 0) {
      return setError("Vui lòng chọn ít nhất 1 món");
    }
    if (!form.discountValue || Number(form.discountValue) <= 0)
      return setError("Giá trị giảm phải lớn hơn 0");
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        restaurants: restaurantIds,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        foodIds: form.type === "food" ? selectedFoods : [],
      };
      if (promotion) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/promotions/update/${promotion._id}`,
          payload,
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/promotions/add`,
          payload,
        );
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0e4d8]">
          <h2 className="text-lg font-bold text-[#3a2010]">
            {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#fdf8f5] transition-colors cursor-pointer text-[#a08060]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Tên */}
          <div>
            <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
              Tên khuyến mãi *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="VD: Giảm 20% cuối tuần"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] placeholder-[#c0a890] focus:outline-none focus:border-[#C8714A] transition-colors"
            />
          </div>

          {/* Chọn cở sở đẻ áp dụng khuyến mãi*/}
          <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
            Chọn cơ sở *
          </label>
          <div className="max-h-40 overflow-y-auto border border-[#e8d8c8] rounded-xl p-3 space-y-2">
            {restaurants.map((r) => (
              <label
                key={r._id}
                className="flex items-center gap-2 text-sm text-[#3a2010]"
              >
                <input
                  type="checkbox"
                  checked={restaurantIds.includes(r._id)}
                  onChange={() => {
                    setRestaurantIds((prev) =>
                      prev.includes(r._id)
                        ? prev.filter((id) => id !== r._id)
                        : [...prev, r._id],
                    );
                  }}
                />
                {r.name}
              </label>
            ))}
          </div>

          <p className="text-xs text-[#a08060] mt-1">
            Đã chọn {restaurantIds.length} nhà hàng
          </p>

          {/* Loại + Kiểu giảm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Loại KM
              </label>

              <div className="flex gap-2">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => set("type", key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      form.type === key
                        ? "bg-[#FFF3EE] border-[#C8714A] text-[#C8714A]"
                        : "border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
            {form.type === "food" && (
              <div>
                <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-2">
                  Chọn món áp dụng *
                </label>

                <div className="max-h-40 overflow-y-auto border border-[#e8d8c8] rounded-xl p-3 space-y-2">
                  {foods.map((f) => (
                    <label
                      key={f._id}
                      className="flex items-center gap-2 text-sm text-[#3a2010]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFoods.includes(f._id)}
                        onChange={() => {
                          setSelectedFoods((prev) =>
                            prev.includes(f._id)
                              ? prev.filter((id) => id !== f._id)
                              : [...prev, f._id],
                          );
                        }}
                      />
                      {f.name}
                    </label>
                  ))}
                </div>

                <p className="text-xs text-[#a08060] mt-1">
                  Đã chọn {selectedFoods.length} món
                </p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Kiểu giảm
              </label>
              <div className="flex gap-2">
                {Object.entries(DISCOUNT_TYPE_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => set("discountType", key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      form.discountType === key
                        ? "bg-[#FFF3EE] border-[#C8714A] text-[#C8714A]"
                        : "border-[#e8d8c8] text-[#7a6050] hover:bg-[#fdf8f5]"
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Giá trị giảm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Giá trị giảm * {form.discountType === "percent" ? "(%)" : "(đ)"}
              </label>
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder={
                  form.discountType === "percent" ? "VD: 20" : "VD: 50000"
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] placeholder-[#c0a890] focus:outline-none focus:border-[#C8714A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Giảm tối đa (đ)
              </label>
              <input
                type="number"
                min="0"
                value={form.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)}
                placeholder="Không giới hạn"
                disabled={form.discountType === "fixed"}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] placeholder-[#c0a890] focus:outline-none focus:border-[#C8714A] transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          {/* Min order + Usage limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Đơn tối thiểu (đ)
              </label>
              <input
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={(e) => set("minOrderValue", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] placeholder-[#c0a890] focus:outline-none focus:border-[#C8714A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Giới hạn lượt dùng
              </label>
              <input
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)}
                placeholder="Không giới hạn"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] placeholder-[#c0a890] focus:outline-none focus:border-[#C8714A] transition-colors"
              />
            </div>
          </div>

          {/* Ngày */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] focus:outline-none focus:border-[#C8714A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#a08060] uppercase tracking-wider mb-1.5">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8d8c8] text-sm text-[#3a2010] focus:outline-none focus:border-[#C8714A] transition-colors"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-semibold text-[#3a2010]">
              Kích hoạt ngay
            </span>
            <button
              onClick={() => set("isActive", !form.isActive)}
              className="cursor-pointer transition-colors"
            >
              {form.isActive ? (
                <ToggleRight className="w-8 h-8 text-[#C8714A]" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-[#c0a890]" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#f0e4d8]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-[#e8d8c8] text-sm font-medium text-[#7a6050] hover:bg-[#fdf8f5] transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-2xl bg-[#C8714A] text-white text-sm font-semibold hover:bg-[#b5623e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Đang lưu...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />{" "}
                {promotion ? "Cập nhật" : "Thêm mới"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PromotionModal;
