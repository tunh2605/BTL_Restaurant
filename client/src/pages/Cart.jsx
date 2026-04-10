import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Banknote,
  ChevronRight,
  ShoppingBag,
  MapPin,
  FileText,
  Phone,
  X,
  User,
} from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

// ── Main Cart Page ─────────────────────────────────────────
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Lấy restaurantId đầu tiên (giỏ hàng chỉ hỗ trợ 1 chi nhánh)
  const restaurantId = cartItems[0]?.restaurantId || null;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          `${API}/api/promotions/available?restaurantId=${restaurantId}`,
        );
        setPromotions(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (restaurantId) fetchPromotions();
  }, [restaurantId]);

  useEffect(() => {
    setSelectedPromotion(null);
    setDiscount(0);
  }, [cartItems]);

  // hàm kiểm tra và áp dụng voucher
  const applyPromotion = (promo) => {
    const now = new Date();

    // check active
    if (!promo.isActive) return toast.error("Mã không hoạt động");

    // check date
    if (new Date(promo.startDate) > now || new Date(promo.endDate) < now) {
      return toast.error("Mã đã hết hạn");
    }

    // check usage
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return toast.error("Mã đã hết lượt sử dụng");
    }

    // check min order
    if (totalPrice < promo.minOrderValue) {
      return toast.error(`Đơn tối thiểu ${promo.minOrderValue}`);
    }

    // khi người dùng nhấp lần 2 ta set về mặc định
    if (selectedPromotion?._id === promo._id) {
      setSelectedPromotion(null);
      setDiscount(0);
      return;
    }

    let discountAmount = 0;

    // case mã giảm giá cho order
    if (promo.type === "order") {
      if (promo.discountType === "percent") {
        discountAmount = (totalPrice * promo.discountValue) / 100;

        if (promo.maxDiscount) {
          discountAmount = Math.min(discountAmount, promo.maxDiscount);
        }
      } else {
        discountAmount = promo.discountValue;
      }
    }

    // case mã giảm giá cho food
    if (promo.type === "food") {
      let applicableTotal = 0;

      cartItems.forEach((item) => {
        const isValid = promo.foods?.some(
          (pf) => String(pf.food._id) === String(item.foodId),
        );
        if (isValid) {
          applicableTotal += item.price * item.quantity;
        }
      });

      if (applicableTotal === 0) {
        return toast.error("Không có món phù hợp");
      }

      if (promo.discountType === "percent") {
        discountAmount = (applicableTotal * promo.discountValue) / 100;

        if (promo.maxDiscount) {
          discountAmount = Math.min(discountAmount, promo.maxDiscount);
        }
      } else {
        discountAmount = Math.min(promo.discountValue, applicableTotal);
      }
    }

    setSelectedPromotion(promo);
    setDiscount(discountAmount);

    toast.success("Áp dụng mã thành công !");
  };

  // Nhóm items theo restaurant
  const grouped = cartItems.reduce((acc, item) => {
    const key = item.restaurantId || "none";
    if (!acc[key]) {
      acc[key] = {
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const groupedList = Object.values(grouped);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thanh toán.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }
    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Số điện thoại không hợp lệ.");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmCheckout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      if (paymentMethod === "vnpay") {
        const payRes = await axios.post(`${API}/api/payments/create-url`, {
          restaurantId,
          items: cartItems.map((i) => ({
            foodId: i.foodId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          promotionId: selectedPromotion?._id ?? null,
          note,
          phone,
        });
        window.location.href = payRes.data.paymentUrl;
      } else {
        await axios.post(`${API}/api/orders`, {
          restaurantId,
          items: cartItems.map((i) => ({
            foodId: i.foodId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          promotionId: selectedPromotion?._id ?? null,
          note,
          phone,
          paymentMethod: "cash",
        });
        clearCart();
        toast.success(
          "Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.",
        );
        navigate("/profile");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 relative overflow-hidden">
        <BlurCircle top="20%" left="10%" size="300px" color="bg-primary/40" />
        <BlurCircle
          bottom="10%"
          right="5%"
          size="250px"
          color="bg-secondary/60"
        />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-[#FEEFDB] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-primary-dull" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-400 mb-8">
            Bạn chưa thêm món nào vào giỏ hàng.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-dull text-white rounded-full font-semibold hover:bg-primary-dull/90 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Xem thực đơn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 md:px-16 lg:px-24 pt-40 pb-10 overflow-hidden">
        <BlurCircle
          top="50%"
          left="50%"
          size="500px"
          center
          color="bg-primary/50"
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-block bg-primary/60 text-primary-dull rounded-full px-4 py-1 text-sm font-medium">
            Đơn hàng của bạn
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight py-6">
            Giỏ hàng
            <span className="text-primary-dull italic"> DoMasala</span>
          </h1>
        </div>
      </section>

      {/* Main */}
      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {groupedList.map((group) => (
              <div
                key={group.restaurantId}
                className="bg-white rounded-3xl shadow-sm p-6"
              >
                {/* Restaurant header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-[#FEEFDB] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-dull" />
                  </div>
                  <span className="font-semibold text-gray-700">
                    {group.restaurantName || "Chi nhánh"}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={`${item.foodId}-${item.restaurantId}`}
                      className="flex gap-4 items-center"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#F5EDE3]">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-primary-dull font-medium mt-0.5">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 bg-[#F5EDE3] rounded-full px-1 py-1 shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.foodId,
                              item.restaurantId,
                              item.quantity - 1,
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.foodId,
                              item.restaurantId,
                              item.quantity + 1,
                            )
                          }
                          className="w-7 h-7 rounded-full bg-primary-dull flex items-center justify-center text-white hover:bg-primary-dull/90 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.foodId, item.restaurantId)
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEEFDB] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-dull" />
                </div>
                <span className="font-semibold text-gray-700">
                  Ghi chú đơn hàng
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Yêu cầu đặc biệt cho đơn hàng..."
                rows={3}
                className="w-full bg-[#F5EDE3] rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Right: Summary + Payment */}
          <div className="space-y-4">
            {/* Contact info */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEEFDB] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-dull" />
                </div>
                <span className="font-semibold text-gray-700">
                  Số điện thoại liên hệ
                </span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="w-full bg-[#F5EDE3] rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.foodId}-summary`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-500 truncate pr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-gray-700 font-medium shrink-0">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString()}đ</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng</span>
                  <span>{(totalPrice - discount).toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            {/* Chọn mã giảm giá*/}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                Mã giảm giá
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {promotions.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => applyPromotion(p)}
                    className={`w-full text-left p-3 rounded-xl border ${
                      selectedPromotion?._id === p._id
                        ? "border-primary-dull bg-primary/10"
                        : "border-gray-100 hover:border-primary/30"
                    }`}
                  >
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">
                      {p.discountType === "percent"
                        ? `-${p.discountValue}%`
                        : `-${p.discountValue.toLocaleString()}đ`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {/* VNPay */}
                <button
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    paymentMethod === "vnpay"
                      ? "border-primary-dull bg-primary/10"
                      : "border-gray-100 hover:border-primary/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">VNPay</p>
                    <p className="text-xs text-gray-400">
                      Thẻ ATM / Visa / QR Code
                    </p>
                  </div>
                  <div
                    className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      paymentMethod === "vnpay"
                        ? "border-primary-dull bg-primary-dull"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "vnpay" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                {/* Cash */}
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-primary-dull bg-primary/10"
                      : "border-gray-100 hover:border-primary/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <Banknote className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">
                      Tiền mặt
                    </p>
                    <p className="text-xs text-gray-400">
                      Thanh toán khi nhận hàng
                    </p>
                  </div>
                  <div
                    className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      paymentMethod === "cash"
                        ? "border-primary-dull bg-primary-dull"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cash" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-primary-dull text-white rounded-full font-semibold text-base hover:bg-primary-dull/90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  {paymentMethod === "vnpay" ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Thanh toán qua VNPay
                    </>
                  ) : (
                    <>
                      <Banknote className="w-5 h-5" />
                      Xác nhận đặt hàng
                    </>
                  )}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Continue shopping */}
            <Link
              to="/menu"
              className="block text-center text-sm text-gray-400 hover:text-primary-dull transition py-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-61 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-primary-dull px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Xác nhận đơn hàng
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#F5EDE3] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#FEEFDB] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary-dull" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Người đặt</p>
                  <p className="font-semibold text-gray-800">
                    {user?.name || "Khách hàng"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F5EDE3] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#FEEFDB] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary-dull" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">{phone}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Danh sách món</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.foodId}-${item.restaurantId}`}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="text-gray-700">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary-dull">
                    {(totalPrice - discount).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {note && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                  <p className="text-sm text-gray-700 italic">{note}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Phương thức thanh toán
                </p>
                <div className="flex items-center gap-3 p-3 bg-[#F5EDE3] rounded-2xl">
                  {paymentMethod === "vnpay" ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">VNPay</p>
                        <p className="text-xs text-gray-400">
                          Thẻ ATM / Visa / QR Code
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <Banknote className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Tiền mặt</p>
                        <p className="text-xs text-gray-400">
                          Thanh toán khi nhận hàng
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Huỷ
              </button>
              <button
                onClick={confirmCheckout}
                disabled={loading}
                className="flex-1 py-3 bg-primary-dull text-white rounded-full font-semibold hover:bg-primary-dull/90 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Đang xử lý..."
                ) : paymentMethod === "vnpay" ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Thanh toán
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4" />
                    Xác nhận
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
