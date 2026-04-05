import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // cart items: [{ foodId, name, price, image, quantity, note, restaurantId, restaurantName }]
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // item: { foodId, name, price, image, quantity, note, restaurantId, restaurantName }
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.foodId === item.foodId && i.restaurantId === item.restaurantId
      );
      if (existing) {
        return prev.map((i) =>
          i.foodId === item.foodId && i.restaurantId === item.restaurantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (foodId, restaurantId) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.foodId === foodId && i.restaurantId === restaurantId))
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
          : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
