import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email,
          password,
        },
      );
      login(data.user, data.token);
      data.user.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect tới backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login-by-oauth`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDE3] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl px-8 py-10 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#7a3f1e] tracking-tight">
            DoMasala
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-3">
            Chào mừng trở lại
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Hương vị tinh túy đang chờ đón bạn.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Tên đăng nhập hoặc Email
            </label>
            <div className="flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@domain.com"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600">
                Mật khẩu
              </label>
              <button
                type="button"
                className="text-sm text-[#E07A4F] hover:opacity-75 transition"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3">
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8906A] hover:bg-[#d97d58] text-white font-semibold rounded-full py-3 transition-colors duration-200 disabled:opacity-60 mt-2 cursor-pointer"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 tracking-widest font-medium">
            HOẶC
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Đăng nhập bằng Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Chưa có tài khoản?
          <Link to="/register">
            <button className="text-[#E07A4F] font-medium hover:opacity-75 transition">
              Đăng ký ngay
            </button>
          </Link>
        </p>
      </div>

      <div className="flex items-center gap-4 mt-8 text-xs text-gray-400 tracking-widest uppercase">
        <button className="hover:text-gray-600 transition">Điều khoản</button>
        <span>|</span>
        <button className="hover:text-gray-600 transition">Bảo mật</button>
        <span>|</span>
        <button className="hover:text-gray-600 transition">Hỗ trợ</button>
      </div>
    </div>
  );
};

export default LoginPage;
