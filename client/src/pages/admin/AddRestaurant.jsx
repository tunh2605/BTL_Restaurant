import { Loader2, Plus, Upload } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { uploadToCloudinary } from "../../libs/uploadToCloudinary";
import { useFood } from "../../context/FoodContext";

const AddRestaurant = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "",
    closeTime: "",
    isOpen: true,
  });
  const { fetchRestaurants, fetchStats } = useFood();

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên cơ sở!");
      return false;
    }

    if (!form.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ!");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return false;
    }

    if (!/^\d{9,11}$/.test(form.phone.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ!");
      return false;
    }

    if (!form.openTime || !form.closeTime) {
      toast.error("Vui lòng nhập giờ mở và đóng!");
      return false;
    }

    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh!");
      return false;
    }

    return true;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      setUploading(true);
      // upload tất cả ảnh song song
      const imageUrls = await Promise.all(
        images.map((file) => uploadToCloudinary(file)),
      );
      // gọi API thêm nhà hàng
      await axios.post(`${import.meta.env.VITE_API_URL}/api/restaurants/add`, {
        ...form,
        images: imageUrls,
      });

      toast.success("Thêm cơ sở thành công");
      setImages([]);
      setPreviews([]);
      setForm({
        name: "",
        address: "",
        phone: "",
        openTime: "",
        closeTime: "",
      });
      await Promise.all([fetchRestaurants(), fetchStats()]);
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2 text-primary-dull font-bold text-base">
        <Plus className="w-5 h-5" />
        Thêm cơ sở mới
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Tên nhà hàng
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. DoMasala – Quận 1"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none text-sm text-gray-700 placeholder:text-gray-300 transition-all"
          />
        </div>
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Địa chỉ
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Số nhà, tên đường..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none text-sm text-gray-700 placeholder:text-gray-300 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Số điện thoại
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="090 000 0000"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none text-sm text-gray-700 placeholder:text-gray-300 transition-all"
          />
        </div>
      </div>

      {/* Row 2: giờ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Giờ mở
          </label>
          <input
            type="time"
            name="openTime"
            value={form.openTime}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none text-sm text-gray-700 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Giờ đóng
          </label>
          <input
            type="time"
            name="closeTime"
            value={form.closeTime}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dull focus:ring-2 focus:ring-primary-dull/20 outline-none text-sm text-gray-700 transition-all"
          />
        </div>
      </div>

      {/* Toggle trạng thái */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Trạng thái hoạt động
          </p>
          <p className="text-xs text-gray-400">
            {form.isOpen ? "Đang mở cửa" : "Đang đóng cửa"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
            form.isOpen ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
              form.isOpen ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Row 3: upload nhiều ảnh */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Ảnh cơ sở ({images.length} ảnh)
        </label>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={src}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Thêm ảnh nữa */}
            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-dull hover:bg-primary-dull/5 transition-all">
              <Plus className="w-5 h-5 text-gray-300" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}

        {/* Upload ban đầu khi chưa có ảnh */}
        {previews.length === 0 && (
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 px-4 cursor-pointer hover:border-primary-dull hover:bg-primary-dull/5 transition-all text-sm text-gray-400 hover:text-primary-dull">
            <Upload className="w-4 h-4" />
            Tải ảnh đại diện cơ sở (có thể chọn nhiều ảnh)
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-8 py-3 bg-primary-dull text-white font-semibold rounded-xl hover:bg-primary-dull/90 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            "Lưu thông tin"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddRestaurant;
