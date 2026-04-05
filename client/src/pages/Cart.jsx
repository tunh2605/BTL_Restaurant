import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;
const SHIPPING_FEE = 25000;
const FREE_SHIPPING_THRESHOLD = 500000;

// ── CartItem Card ──────────────────────────────────────────
const CartItemCard = ({ item, onUpdate, onRemove, updating }) => {
  const isUpdating = updating === item._id;

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fadeUp">
      {/* images */}
      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
        <img
          src={item.food?.image || item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-base truncate">
          {item.name}
        </p>
        <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
          {item.food?.description || ""}
        </p>

        {/* quantity */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 bg-[#f0ece8] rounded-full px-2 py-1">
            <button
              onClick={() => onUpdate(item._id, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-40"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-700">
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin mx-auto" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdate(item._id, item.quantity + 1)}
              disabled={isUpdating}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-40"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* price + remove */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <p className="font-bold text-primary-dull text-base">
          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
        </p>
        <button
          onClick={() => onRemove(item._id)}
          disabled={isUpdating}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Xóa
        </button>
      </div>
    </div>
  );
};

// ── Order Summary ──────────────────────────────────────────
const OrderSummary = ({ subtotal, onCheckout, checking }) => {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const nextFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h2>

      {/* items*/}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tạm tính</span>
          <span className="font-medium text-gray-700">
            {subtotal.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Phí vận chuyển</span>
          <span
            className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-700"}`}
          >
            {shipping === 0
              ? "Miễn phí"
              : `${shipping.toLocaleString("vi-VN")}đ`}
          </span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between items-end">
          <div>
            <p className="font-bold text-gray-800 text-base">Tổng cộng</p>
            <p className="text-xs text-gray-400">Đã bao gồm VAT</p>
          </div>
          <p className="text-2xl font-bold text-primary-dull">
            {total.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      {/* checkout button */}
      <button
        onClick={onCheckout}
        disabled={checking || subtotal === 0}
        className="w-full py-4 rounded-2xl bg-primary-dull text-white font-bold text-base hover:bg-primary-dull/90 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {checking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Thanh toán ngay"
        )}
      </button>

      {/* freeship hint */}
      {nextFreeShipping > 0 && (
        <div className="flex items-start gap-2 bg-green-50 rounded-xl p-3">
          <Tag className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-xs text-green-700 leading-relaxed">
            Bạn đã đủ điều kiện để được{" "}
            <span className="font-bold">miễn phí vận chuyển</span> cho đơn hàng
            tiếp theo!
          </p>
        </div>
      )}

      {/* terms */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Bằng việc bấm thanh toán, bạn đồng ý với các{" "}
        <Link
          to="/terms"
          className="underline hover:text-gray-600 transition-colors"
        >
          Điều khoản dịch vụ
        </Link>{" "}
        của DoMasala.
      </p>
    </div>
  );
};

// ── Empty Cart ─────────────────────────────────────────────
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center animate-fadeUp">
    <div className="w-24 h-24 rounded-full bg-[#fdf0e8] flex items-center justify-center">
      <ShoppingBag className="w-10 h-10 text-primary-dull" />
    </div>
    <h2 className="text-2xl font-bold text-gray-700">Giỏ hàng trống</h2>
    <p className="text-gray-400 max-w-sm">
      Hãy khám phá thực đơn và thêm những món ăn yêu thích vào giỏ hàng.
    </p>
    <Link
      to="/menu"
      className="mt-2 px-6 py-3 rounded-2xl bg-primary-dull text-white font-semibold hover:bg-primary-dull/90 transition-all"
    >
      Khám phá thực đơn
    </Link>
  </div>
);

// ── Main Cart Page ─────────────────────────────────────────
const Cart = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, token } = useAuth();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [checking, setChecking] = useState(false);

  // fetch cart
  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/api/cart`);
      if (data.success && data.data) {
        setCart(data.data);
        setItems(data.data.items || []);
      } else {
        setItems([]);
      }
    } catch {
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [isLoggedIn]);

  // update quantity
  const handleUpdate = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdating(itemId);
    try {
      await axios.put(`${API}/api/cart/update/${itemId}`, { quantity: newQty });
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item,
        ),
      );
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setUpdating(null);
    }
  };

  // remove item
  const handleRemove = async (itemId) => {
    setUpdating(itemId);
    try {
      await axios.delete(`${API}/api/cart/remove/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Đã xóa khỏi giỏ hàng");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setUpdating(null);
    }
  };

  // checkout
  const handleCheckout = async () => {
    setChecking(true);
    try {
      await axios.post(`${API}/api/orders/create`, {
        restaurantId: cart.restaurant?._id,
        items: items.map(({ food, name, price, quantity }) => ({
          foodId: food?._id,
          name,
          price,
          quantity,
        })),
        paymentMethod: "cash",
      });

      // xóa cart sau khi đặt thành công
      await axios.delete(`${API}/api/cart/clear`);

      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setChecking(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dull" />
      </div>
    );

  return (
    <div className="px-6 md:px-16 lg:px-24 pt-32 pb-16 min-h-screen">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-primary-dull hover:text-primary-dull/70 mt-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp tục mua sắm
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* cart items */}
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={item._id} style={{ animationDelay: `${i * 80}ms` }}>
                <CartItemCard
                  item={item}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  updating={updating}
                />
              </div>
            ))}
          </div>

          {/* order summary */}
          <OrderSummary
            subtotal={subtotal}
            onCheckout={handleCheckout}
            checking={checking}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
