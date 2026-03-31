import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginRef = useRef(login);
  const handled = useRef(false);

  // Đọc params ngay lập tức, trước khi bất kỳ re-render nào xảy ra
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const token = urlParams.get("token");
  const userData = urlParams.get("user");

  useEffect(() => {
    // Chỉ chạy đúng 1 lần dù login reference có thay đổi
    if (handled.current) return;
    handled.current = true;

    try {
      if (error) {
        toast.error("Đăng nhập Google thất bại: " + error);
        navigate("/login");
        return;
      }

      if (token && userData) {
        const user = JSON.parse(decodeURIComponent(userData));
        loginRef.current(user, token);
        toast.success(`Chào mừng ${user.name}!`);
        if (user.role === "admin" || user.role === "hqadmin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Không nhận được thông tin từ Google");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error trong auth callback:", err);
      toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
      navigate("/login");
    }
  }, [navigate, error, token, userData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDE3]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8906A] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Đang xử lý đăng nhập...
        </h2>
        <p className="text-sm text-gray-600">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;