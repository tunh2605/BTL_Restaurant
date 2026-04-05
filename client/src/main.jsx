import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FoodProvider } from "./context/FoodContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <FoodProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FoodProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
);
