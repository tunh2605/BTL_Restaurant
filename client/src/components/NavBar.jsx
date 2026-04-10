import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LogOut,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import getOptimizedImage from "../libs/getOptimizedImage";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Thực đơn", to: "/menu" },
    { label: "Đặt bàn", to: "/reserve" },
    { label: "Giới thiệu", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 z-60 w-full flex items-center justify-between 
      px-3 md:px-12 lg:px-32 py-1.5 md:py-2 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm"
      >
        <Link to="/" className="shrink-0">
          <img
            src={assets.restaurantLogo}
            alt="DoMasala"
            className="w-12 h-auto md:w-18"
          />
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 px-8 py-3 text-[#464745]">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                `relative transition-all duration-300 ${
                  isActive
                    ? "text-primary-dull font-semibold"
                    : "hover:text-primary-dull"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-primary-dull transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: cart + user */}
        <div className="flex gap-3 md:gap-6 items-center shrink-0">
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-gray-600 hover:text-primary-dull transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-primary-dull text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {!user ? (
            <Link to="/login">
              <button className="px-3 py-1 md:px-7 md:py-2 text-white text-sm bg-primary-dull hover:bg-primary-dull/90 transition rounded-full font-medium cursor-pointer">
                Đăng nhập
              </button>
            </Link>
          ) : (
            <div className="relative group inline-block">
              {user.avatar ? (
                <img
                  src={getOptimizedImage(user.avatar, 100)}
                  alt={user.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-primary-dull cursor-pointer"
                />
              ) : (
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-dull flex items-center justify-center text-white font-semibold text-sm cursor-pointer select-none">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="absolute right-0 top-full h-3 w-full" />

              <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="border-b border-gray-100">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fdf8f5] transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </Link>
                </div>
                {(user?.role === "hqadmin" || user?.role === "admin") && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fdf8f5] transition-colors border-b border-gray-100"
                  >
                    <LayoutDashboardIcon className="w-4 h-4 text-gray-400" />
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}

          <MenuIcon
            className="md:hidden w-6 h-6 cursor-pointer text-gray-700"
            onClick={() => setOpen(true)}
          />
        </div>
      </header>

      {/* Mobile Navigation Menu - Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-9999 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-8 text-gray-100 transition-all duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <XIcon
          className="absolute top-5 right-5 w-6 h-6 cursor-pointer"
          onClick={() => setOpen(false)}
        />

        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
            className={({ isActive }) =>
              `relative text-xl transition-all duration-300 ${
                isActive
                  ? "text-primary-dull font-semibold"
                  : "hover:text-primary-dull/80"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-primary-dull transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default NavBar;
