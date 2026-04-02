import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Plus,
  X,
  ChevronDown,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// hàm hỗ trợ upload
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error("Upload ảnh thất bại");
  const data = await res.json();
  return data.secure_url;
};

// dropdown chọn nhiều nhà hàng
const MultiSelectDropdown = ({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id) =>
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  const displayText =
    selected.length === 0
      ? placeholder
      : options
          .filter((o) => selected.includes(o._id))
          .map((o) => o.name)
          .join(", ");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm transition-all duration-200
          ${open ? "border-[#C8714A] bg-white shadow-sm" : "border-[#e8d8c8] bg-[#faf7f4] hover:border-[#C8714A]/50"}
          ${selected.length === 0 ? "text-gray-400" : "text-gray-700 font-medium"}`}
      >
        <span className="truncate text-left">{displayText}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#C8714A] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#e8d8c8] shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {options.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Không có dữ liệu
              </p>
            ) : (
              options.map((opt) => {
                const active = selected.includes(opt._id);
                return (
                  <button
                    key={opt._id}
                    type="button"
                    onClick={() => toggle(opt._id)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors duration-150
                      ${active ? "bg-[#fdf0e8] text-[#7a3f1e] font-medium" : "text-gray-600 hover:bg-[#faf7f4]"}`}
                  >
                    <span>{opt.name}</span>
                    {active && (
                      <Check className="w-4 h-4 text-[#C8714A] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-[#e8d8c8] px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-[#C8714A] font-medium">
                {selected.length} đã chọn
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Xóa hết
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// dropdown chọn danh mục cho món ăn
const SelectDropdown = ({ options = [], value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o._id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm transition-all duration-200
          ${open ? "border-[#C8714A] bg-white shadow-sm" : "border-[#e8d8c8] bg-[#faf7f4] hover:border-[#C8714A]/50"}
          ${!selected ? "text-gray-400" : "text-gray-700 font-medium"}`}
      >
        <span>{selected ? selected.name : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#C8714A] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className=" absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#e8d8c8] shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1 no-scrollbar">
            {options.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Không có dữ liệu
              </p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt._id}
                  type="button"
                  onClick={() => {
                    onChange(opt._id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors duration-150
                    ${value === opt._id ? "bg-[#fdf0e8] text-[#7a3f1e] font-medium" : "text-gray-600 hover:bg-[#faf7f4]"}`}
                >
                  <span>{opt.name}</span>
                  {value === opt._id && (
                    <Check className="w-4 h-4 text-[#C8714A] shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// main
const AddFood = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    restaurantIds: [],
    price: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/categories/all-categories`)
      .then((res) => setCategories(res.data?.data || res.data || []))
      .catch(() => toast.error("Không thể tải danh mục"));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/restaurants/all-restaurants`)
      .then((res) => setRestaurants(res.data?.data || res.data || []))
      .catch(() => toast.error("Không thể tải nhà hàng"));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Chỉ hỗ trợ JPG, PNG, WEBP");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Vui lòng nhập tên món ăn");
    if (!form.categoryId) return toast.error("Vui lòng chọn danh mục");
    if (form.restaurantIds.length === 0)
      return toast.error("Vui lòng chọn ít nhất 1 chi nhánh");
    if (!form.price || Number(form.price) <= 0)
      return toast.error("Vui lòng nhập giá hợp lệ");
    if (!imageFile) return toast.error("Vui lòng chọn ảnh món ăn");

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(imageFile);

      setUploading(false);
      setSubmitting(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/foods/add`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: imageUrl,
        category: form.categoryId,
        restaurants: form.restaurantIds,
      });

      toast.success("Thêm món ăn thành công!");
      navigate("/admin/foods");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm món ăn thất bại");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const isLoading = uploading || submitting;

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* nơi upload ảnh */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8714A]">
              Ảnh Món Ăn
            </p>

            {/* Drop zone */}
            <div
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-200
                ${
                  imagePreview
                    ? "border-transparent cursor-default"
                    : "border-[#d4b89a] hover:border-[#C8714A] cursor-pointer bg-[#faf3ec]"
                }
                aspect-square flex items-center justify-center`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {/* lớp phủ cho hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/90 rounded-xl text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-red-500/90 rounded-xl text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  {/* placeholder cho background ảnh */}
                  <div
                    className="absolute inset-0 opacity-10 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23C8714A' opacity='0.3'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="relative w-14 h-14 rounded-2xl bg-[#C8714A]/15 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#C8714A]" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C8714A] flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#7a3f1e]">
                      Tải lên hoặc chọn ảnh
                    </p>
                    <p className="text-xs text-[#b08060] mt-1 leading-relaxed">
                      Hỗ trợ JPG, PNG (Tối đa 5MB).
                      <br />
                      Khuyên dùng tỉ lệ 1:1 cho hiển thị tốt nhất.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* thumbnail strip — chỉ 1 ảnh */}
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#C8714A]">
                  <img
                    src={imagePreview}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#C8714A]/20" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#d4b89a] bg-[#faf3ec] flex items-center justify-center text-[#d4b89a]">
                  <Camera className="w-5 h-5" />
                </div>
              )}
              <p className="text-xs text-[#b08060]">Chỉ 1 ảnh được chọn</p>
            </div>
          </div>

          {/* form nhập liệu phía bên phải */}
          <div className="flex flex-col gap-5">
            {/* Basic info card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full bg-[#C8714A]" />
                <h2 className="text-base font-bold text-gray-800">
                  Thông tin cơ bản
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* tên món ăn */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                    Tên Món Ăn
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Paneer Tikka Masala"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8d8c8] bg-[#faf7f4] text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#C8714A] focus:bg-white focus:shadow-sm transition-all duration-200"
                  />
                </div>

                {/* danh mục + chi nhánh */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                      Danh Mục
                    </label>
                    <SelectDropdown
                      options={categories}
                      value={form.categoryId}
                      onChange={(id) =>
                        setForm((f) => ({ ...f, categoryId: id }))
                      }
                      placeholder="Chọn danh mục"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                      Chi Nhánh
                    </label>
                    <MultiSelectDropdown
                      options={restaurants}
                      selected={form.restaurantIds}
                      onChange={(ids) =>
                        setForm((f) => ({ ...f, restaurantIds: ids }))
                      }
                      placeholder="Tất cả chi nhánh"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* chi tiết và giá cả*/}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full bg-[#C8714A]" />
                <h2 className="text-base font-bold text-gray-800">
                  Chi tiết & Giá cả
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* giá */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                    Giá Bán (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="w-full px-4 py-3 pr-8 rounded-2xl border border-[#e8d8c8] bg-[#faf7f4] text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#C8714A] focus:bg-white focus:shadow-sm transition-all duration-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#C8714A] font-semibold">
                      đ
                    </span>
                  </div>
                </div>

                {/*mô tả */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                    Mô Tả Món Ăn
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả hương vị, nguyên liệu chính và cách chế biến đặc biệt của món ăn..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8d8c8] bg-[#faf7f4] text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#C8714A] focus:bg-white focus:shadow-sm transition-all duration-200 resize-none no-scrollbar"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="text-sm font-semibold text-gray-400 hover:text-gray-600 tracking-wide uppercase transition-colors disabled:opacity-40"
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5c3520] hover:bg-[#7a3f1e] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? "Đang tải ảnh..." : "Đang lưu..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Thêm món ăn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
