import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // true lúc đầu vì cần verify token

  // Mỗi khi token thay đổi, gắn vào header mặc định của axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Khi app khởi động, nếu có token trong localStorage thì tự động lấy thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/user`,
        );
        setUser(data);
      } catch (error) {
        // Token hết hạn hoặc không hợp lệ → đăng xuất
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Đăng nhập — gọi hàm này sau khi API login thành công
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAdmin = user?.role === "admin" || user?.role === "hqadmin";
  const isHQAdmin = user?.role === "hqadmin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isLoggedIn,
        isHQAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook tiện dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải dùng trong AuthProvider");
  return context;
};

export default AuthContext;
