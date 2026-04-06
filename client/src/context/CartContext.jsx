import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // ← thêm import

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // khởi tạo cart theo userId ngay từ đầu
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Chưa biết user lúc init thì load tạm, sẽ sync lại trong useEffect
      return [];
    } catch {
      return [];
    }
  });

  // khi user thay đổi (login/ logout/ đổi tài khoản)
  useEffect(() => {
    if (!user) {
      // đăng xuất: xóa sạch
      setCartItems([]);
    } else {
      // đăng nhập: load đúng giỏ hàng của user này
      try {
        const saved = localStorage.getItem(`cart_${user._id}`);
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {
        setCartItems([]);
      }
    }
  }, [user?._id]); // chỉ chạy khi userId thực sự thay đổi

  // lưu theo userId, không lưu khi chưa đăng nhập
  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user?._id]);

  // dọn key "cart" cũ (migration một lần)
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.foodId === item.foodId && i.restaurantId === item.restaurantId,
      );
      if (existing) {
        return prev.map((i) =>
          i.foodId === item.foodId && i.restaurantId === item.restaurantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (foodId, restaurantId) => {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.foodId === foodId && i.restaurantId === restaurantId),
      ),
    );
  };

  const updateQuantity = (foodId, restaurantId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodId, restaurantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.foodId === foodId && i.restaurantId === restaurantId
          ? { ...i, quantity }
          : i,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user?._id) localStorage.removeItem(`cart_${user._id}`);
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
