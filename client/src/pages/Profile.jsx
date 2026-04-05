import { useState, useEffect } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  ShoppingBag,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  LogOut,
  Camera,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";



// ─── Status config for orders ─────────────────────────────────────────────────
const ORDER_STATUS = {
  pending:    { label: "Chờ xác nhận", color: "bg-amber-50 text-amber-600",   icon: Clock },
  confirmed:  { label: "Đã xác nhận",  color: "bg-blue-50 text-blue-600",     icon: CheckCircle2 },
  preparing:  { label: "Đang làm",     color: "bg-purple-50 text-purple-600", icon: Clock },
  completed:  { label: "Hoàn thành",   color: "bg-green-50 text-green-700",   icon: CheckCircle2 },
  cancelled:  { label: "Đã huỷ",       color: "bg-red-50 text-red-500",       icon: XCircle },
};

// ─── Status config for reservations ──────────────────────────────────────────
const RESERVATION_STATUS = {
  pending:   { label: "Chờ xác nhận", color: "bg-amber-50 text-amber-600", icon: Clock },
  confirmed: { label: "Đã xác nhận",  color: "bg-blue-50 text-blue-600",   icon: CheckCircle2 },
  completed: { label: "Hoàn thành",   color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Đã huỷ",       color: "bg-red-50 text-red-500",     icon: XCircle },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const OrderStatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS[status] || ORDER_STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
};

const ReservationStatusBadge = ({ status }) => {
  const cfg = RESERVATION_STATUS[status] || RESERVATION_STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "info",         label: "Thông tin", icon: User },
  { key: "orders",       label: "Đơn hàng",  icon: ShoppingBag },
  { key: "reservations", label: "Đặt bàn",   icon: CalendarDays },
];

// ─── Main component ───────────────────────────────────────────────────────────
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  // ─── Real orders ──────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersFetched, setOrdersFetched] = useState(false);

  const fetchMyOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/my`
      );
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
      setOrdersFetched(true);
    }
  };

  // Fetch ngay khi user sẵn sàng (không đợi mở tab)
  useEffect(() => {
    if (user && !ordersFetched) fetchMyOrders();
  }, [user]);

  // ─── Real reservations ────────────────────────────────────────────────────
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [resFetched, setResFetched] = useState(false);

  const fetchMyReservations = async () => {
    if (!user) return;
    setResLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reservations/my`
      );
      setReservations(data);
    } catch {
      setReservations([]);
    } finally {
      setResLoading(false);
      setResFetched(true);
    }
  };

  // Fetch reservations ngay khi user sẵn sàng
  useEffect(() => {
    if (user && !resFetched) fetchMyReservations();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avatarSrc   = user?.avatar || assets.profile;
  const displayName = user?.name   || "Khách";
  const displayEmail= user?.email  || "";
  const isAdmin     = user?.role   === "admin";
  const joinDate    = user?.createdAt ? formatDate(user.createdAt) : "—";

  const successOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 md:px-16 lg:px-24 pt-36 pb-10 overflow-hidden">
        <BlurCircle top="50%" left="50%" size="500px" center color="bg-primary/50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 max-w-4xl mx-auto">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl">
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = assets.profile; }}
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-dull text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dull/90 transition cursor-pointer">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <h1 className="text-3xl font-bold text-gray-800">{displayName}</h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-dull bg-primary/60 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-1.5 justify-center md:justify-start">
              <Mail className="w-3.5 h-3.5" />
              {displayEmail}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 shrink-0">
            {[
              { label: "Đơn hàng", value: ordersLoading ? "…" : orders.length, icon: Package },
              { label: "Đặt bàn", value: resLoading ? "…" : reservations.length, icon: CalendarDays },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl px-5 py-3 text-center shadow-sm min-w-[80px]">
                <p className="text-2xl font-bold text-primary-dull">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tab bar */}
          <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm mb-6 w-fit">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === key
                    ? "bg-primary-dull text-white shadow"
                    : "text-gray-500 hover:text-gray-700 hover:bg-[#F5EDE3]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab: Thông tin ── */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
              {/* Info card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-7 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Thông tin tài khoản</h2>

                {[
                  { label: "Họ và tên",   value: displayName,                          icon: User },
                  { label: "Email",        value: displayEmail,                         icon: Mail },
                  { label: "Vai trò",      value: isAdmin ? "Quản trị viên" : "Khách hàng", icon: ShieldCheck },
                  { label: "Ngày tham gia",value: joinDate,                             icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5EDE3] flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary-dull" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm text-gray-700 font-semibold mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions card */}
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">Tài khoản</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F5EDE3] text-sm font-medium text-gray-700 hover:bg-primary/60 transition cursor-pointer">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-dull" />
                        Chỉnh sửa hồ sơ
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-red-50 text-sm font-medium text-red-500 hover:bg-red-100 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  </div>
                </div>

                {/* Summary mini */}
                <div className="bg-primary-dull rounded-3xl p-6 text-white relative overflow-hidden">
                  <BlurCircle bottom="-40px" right="-40px" size="120px" color="bg-white/10" blur={false} index={0} />
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Tổng cộng</p>
                  <p className="text-4xl font-bold mb-1">{ordersLoading ? "…" : orders.length}</p>
                  <p className="text-sm text-white/70">đơn hàng đã đặt</p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-4xl font-bold mb-1">
                      {resLoading ? "…" : reservations.length}
                    </p>
                    <p className="text-sm text-white/70">lần đặt bàn</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Đơn hàng ── */}
          {activeTab === "orders" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">Lịch sử đơn hàng</h2>
                <span className="text-sm text-gray-400">
                  {ordersFetched ? `${orders.length} đơn` : ""}
                </span>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="w-6 h-6 text-primary-dull animate-spin" />
                </div>
              ) : !ordersFetched || orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium mb-1">Chưa có đơn hàng nào</p>
                  <p className="text-sm text-gray-400">Hãy đặt món để trải nghiệm ẩm thực DoMasala!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-800 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(order.createdAt)}
                          {order.paymentMethod && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.paymentMethod === "vnpay"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {order.paymentMethod === "vnpay" ? "VNPay" : "Tiền mặt"}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary-dull shrink-0">
                        {order.totalPrice.toLocaleString()}đ
                      </p>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between bg-[#F5EDE3] rounded-2xl px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary-dull/20 text-primary-dull text-xs font-bold flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {(item.price * item.quantity).toLocaleString()}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Tab: Đặt bàn ── */}
          {activeTab === "reservations" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">Lịch sử đặt bàn</h2>
                <span className="text-sm text-gray-400">
                  {resFetched ? `${reservations.length} lần` : ""}
                </span>              </div>

              {resLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="w-6 h-6 text-primary-dull animate-spin" />
                </div>
              ) : !resFetched || reservations.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium mb-1">Chưa có đặt bàn nào</p>
                  <p className="text-sm text-gray-400">Hãy đặt bàn để trải nghiệm ẩm thực DoMasala!</p>
                </div>
              ) : (
                reservations.map((res) => (
                  <div key={res._id} className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center shrink-0">
                          <CalendarDays className="w-6 h-6 text-primary-dull" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-800 font-mono">
                              #{res._id.slice(-8).toUpperCase()}
                            </span>
                            <ReservationStatusBadge status={res.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(res.date)} · {res.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {res.numberOfPeople} người
                            </span>
                          </div>
                          {res.note && (
                            <p className="text-xs text-gray-400 mt-1.5 italic">"{res.note}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={() => navigate("/reserve")}
                className="w-full py-3.5 rounded-full bg-primary-dull text-white font-semibold hover:bg-primary-dull/90 transition cursor-pointer mt-2"
              >
                Đặt bàn mới
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
