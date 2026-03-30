import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LogOut,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Thực đơn", to: "/menu" },
    { label: "Đặt bàn", to: "/reserve" },
    { label: "Giới thiệu", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 z-51 w-full flex items-center justify-between px-2 md:px-12 lg:px-32 py-2 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.restaurantLogo} alt="" className="w-18 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-52 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full overflow-hidden transition-all duration-300 ${
          open
            ? "max-md:w-full bg-black/80 backdrop-blur-md text-white"
            : "max-md:w-0 text-[#464745]"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
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
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/cart">
          <ShoppingCartIcon className="h-6 w-6 cursor-pointer text-gray-600 hover:text-primary-dull transition" />
        </Link>
        {!user ? (
          <Link to="/login">
            <button className="px-3 py-1 sm:px-7 sm:py-2 text-white bg-primary-dull hover:bg-primary-dull/90 transition rounded-full font-medium cursor-pointer">
              Đăng nhập
            </button>
          </Link>
        ) : (
          <div className="relative group inline-block">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-primary-dull cursor-pointer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-dull flex items-center justify-center text-white font-semibold text-sm cursor-pointer select-none">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="absolute right-0 top-full h-3 w-full"></div>

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

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-gray-700"
        onClick={() => setOpen(!open)}
      />
    </header>
  );
};

export default NavBar;
