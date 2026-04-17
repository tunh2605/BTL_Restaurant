import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Mail, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên.";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Email không hợp lệ.";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (form.password.length < 6)
      errs.password = "Mật khẩu ít nhất 6 ký tự.";
    if (!form.confirmPassword)
      errs.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu không khớp.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      const firstError = Object.values(errs)[0];
      toast.error(firstError);
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      console.log(form);

      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      toast.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // redirect tới backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login-by-oauth`;
  };

  const passwordMatch =
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDE3] px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl px-8 py-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#7a3f1e] tracking-tight">
            DoMasala
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-3">
            Tạo tài khoản
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Tham gia để trải nghiệm hương vị Ấn Độ.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Họ và tên
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3 transition-shadow ${errors.name ? "ring-1 ring-red-300" : ""}`}
            >
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3 transition-shadow ${errors.email ? "ring-1 ring-red-300" : ""}`}
            >
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="username@domain.com"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Mật khẩu
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3 ${errors.password ? "ring-1 ring-red-300" : ""}`}
            >
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
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

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Xác nhận mật khẩu
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F0EFED] rounded-full px-4 py-3 ${errors.confirmPassword ? "ring-1 ring-red-300" : ""}`}
            >
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              {passwordMatch ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8906A] hover:bg-[#d97d58] text-white font-semibold rounded-full py-3 transition-colors duration-200 disabled:opacity-60 mt-2"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 tracking-widest font-medium">
            HOẶC
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
          Đăng ký bằng Google
        </button>

        {/* Đã có tài khoản */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-[#E07A4F] font-medium hover:opacity-75 transition"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Footer */}
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

export default Register;
