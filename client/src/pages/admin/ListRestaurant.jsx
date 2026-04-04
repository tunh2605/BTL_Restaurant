import {
  MapPin,
  Phone,
  Clock,
  Trash2,
  Pencil,
  Store,
  Users,
  Star,
  Building2,
} from "lucide-react";
import { formatTime } from "../../libs/formatTime.js";
import AddRestaurant from "./AddRestaurant.jsx";
import { useState } from "react";
import axios from "axios";
import ConfirmModal from "../../components/admin/ConfirmModal.jsx";
import { useFood } from "../../context/FoodContext.jsx";
import toast from "react-hot-toast";

// ── RestaurantCard ─────────────────────────────────────────
const RestaurantCard = ({ restaurant, index }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const { fetchRestaurants, fetchStats } = useFood();
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/restaurants/delete/${restaurant._id}`,
      );
      await fetchRestaurants();
      await fetchStats();
      toast.success("Xóa thành công cơ sở" + restaurant.name);
    } catch (err) {
      console.log(err.message);
      toast.error("Lỗi khi xóa cơ sở !");
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.images?.[0]?.url}
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
            <button
              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title={"Xóa cơ sở " + restaurant.name}
        onConfirm={() => handleDelete()}
      />
    </>
  );
};

// ── StatsBar ───────────────────────────────────────────────
const StatsBar = ({ stats }) => (
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

// ── Main Page ─────────────────────────────────────────────
const ListRestaurant = () => {
  const { restaurants, statsData } = useFood();

  const stats = [
    { label: "Tổng số cơ sở", value: statsData?.total || 0, icon: Building2 },
    { label: "Đang hoạt động", value: statsData?.active || 0, icon: Store },
    { label: "Nhân viên", value: statsData?.staffCount || 0, icon: Users },
    { label: "Đánh giá TB", value: "4.8", icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#3a2010]">Quản lý Cơ sở</h1>
        <p className="text-[#a08060] mt-1 text-sm">
          Theo dõi và quản lý mạng lưới nhà hàng DoMasala
        </p>
      </div>

      {/* Add form */}
      <AddRestaurant />

      {/* Restaurant grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r, i) => (
          <RestaurantCard key={r._id} restaurant={r} index={i} />
        ))}
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />
    </div>
  );
};

export default ListRestaurant;
