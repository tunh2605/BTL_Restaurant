import { X, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useFood } from "../../context/FoodContext";

const AddCategoryForm = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshCategories } = useFood();

  useEffect(() => {
    if (!open) {
      setName("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/categories/add`,
        { name },
      );

      toast.success(data.message || "Thêm danh mục thành công");

      await refreshCategories();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-5 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">Thêm danh mục</h2>
            <p className="text-sm text-gray-400">
              Mở rộng thực đơn với một chủ đề mới
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tên danh mục
          </label>

          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ví dụ: Cà ri, Đồ uống..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-secondary-dull text-primary-dull font-semibold disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu danh mục"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
