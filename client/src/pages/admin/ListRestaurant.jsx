import { useState } from "react";
import {
  Plus,
  MapPin,
  Phone,
  Clock,
  Trash2,
  Pencil,
  Upload,
  Store,
  Users,
  Star,
  Building2,
} from "lucide-react";
import { useFood } from "../../context/FoodContext";
import { formatTime } from "../../libs/formatTime.js";

const mockRestaurants = [
  {
    _id: "r1",
    name: "DoMasala - Quận 1",
    address: "123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    phone: "028 3822 0000",
    openTime: "09:00",
    closeTime: "22:00",
    image: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600",
    isOpen: true,
  },
  {
    _id: "r2",
    name: "DoMasala - Quận 7",
    address: "456 Nguyễn Lương Bằng, Tân Phú, Quận 7, TP.HCM",
    phone: "028 5412 1111",
    openTime: "10:00",
    closeTime: "23:00",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
    isOpen: true,
  },
  {
    _id: "r3",
    name: "DoMasala - Thảo Điền",
    address: "78 Xuân Thủy, Thảo Điền, Quận 2, TP.HCM",
    phone: "028 3636 2222",
    openTime: "09:00",
    closeTime: "21:00",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    isOpen: false,
  },
];

const stats = [
  { label: "Tổng số cơ sở", value: "08", icon: Building2 },
  { label: "Đang hoạt động", value: "05", icon: Store },
  { label: "Nhân viên", value: "120", icon: Users },
  { label: "Đánh giá TB", value: "4.8", icon: Star },
];

// ── RestaurantCard ─────────────────────────────────────────
const RestaurantCard = ({ restaurant, index }) => (
  <div
    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeUp"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
      <span
        className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
          restaurant.isOpen
            ? "bg-green-500/90 text-white"
            : "bg-gray-500/80 text-white"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen ? "bg-white animate-pulse" : "bg-gray-300"}`}
        />
        {restaurant.isOpen ? "ĐANG MỞ" : "ĐANG ĐÓNG"}
      </span>
    </div>

    {/* Info */}
    <div className="p-5 space-y-3">
      <h3
        className={`text-lg font-bold ${restaurant.isOpen ? "text-primary-dull" : "text-gray-500"}`}
      >
        {restaurant.name}
      </h3>

      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <span>{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{restaurant.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <span>
            {restaurant.isOpen
              ? `${formatTime(restaurant.openTime)} – ${formatTime(restaurant.closeTime)}`
              : "Đóng cửa (Tạm thời)"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button className="text-sm font-semibold text-primary-dull hover:text-primary-dull/70 transition-colors flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" />
          Chỉnh sửa
        </button>
        <button className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

// ── AddForm ────────────────────────────────────────────────
const AddForm = () => {
  const { restaurants } = useFood();
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "",
    closeTime: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2 text-primary-dull font-bold text-base">
        <Plus className="w-5 h-5" />
        Thêm cơ sở mới
      </div>

      {/* Row 1: name | address | phone | openTime | closeTime */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tên */}
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

        {/* Địa chỉ */}
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

        {/* SĐT */}
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

      {/* Row 2: giờ mở | giờ đóng */}
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

      {/* Row 3: upload + button */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Upload */}
        <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-primary-dull hover:bg-primary-dull/5 transition-all text-sm text-gray-400 hover:text-primary-dull">
          <Upload className="w-4 h-4" />
          {image ? image.name : "Tải ảnh đại diện cơ sở"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* Submit */}
        <button className="sm:w-auto px-8 py-3 bg-primary-dull text-white font-semibold rounded-xl hover:bg-primary-dull/90 transition-all shadow-sm hover:shadow-md active:scale-95">
          Lưu thông tin
        </button>
      </div>
    </div>
  );
};

// ── StatsBar ───────────────────────────────────────────────
const StatsBar = () => (
  <div className="bg-primary-dull rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
    {stats.map((s, i) => (
      <div key={i} className="text-center text-white space-y-1">
        <p className="text-4xl font-bold tracking-tight">{s.value}</p>
        <p className="text-xs uppercase tracking-widest text-white/70">
          {s.label}
        </p>
      </div>
    ))}
  </div>
);

// ── Main Page ──────────────────────────────────────────────
const ListRestaurant = () => (
  <div className="space-y-8">
    {/* Header */}
    <div>
      <h1 className="text-4xl font-bold">Quản lý Cơ sở</h1>
      <p className="text-gray-400 mt-1">
        Theo dõi và quản lý mạng lưới nhà hàng DoMasala
      </p>
    </div>

    {/* Add form */}
    <AddForm />

    {/* Restaurant grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockRestaurants.map((r, i) => (
        <RestaurantCard key={r._id} restaurant={r} index={i} />
      ))}
    </div>

    {/* Stats */}
    <StatsBar />
  </div>
);

export default ListRestaurant;
