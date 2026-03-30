import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  Users,
  BarChart3,
  Megaphone,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navGroups = [
  {
    label: "Ẩm thực & Danh mục",
    items: [
      { label: "Food & Categories", to: "/admin/foods", icon: UtensilsCrossed },
    ],
  },
  {
    label: "Giao dịch & Người dùng",
    items: [
      { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
      { label: "Reservations", to: "/admin/reservations", icon: CalendarCheck },
      { label: "Users", to: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Báo cáo & Tiếp thị",
    items: [
      { label: "Analytics", to: "/admin/report", icon: BarChart3 },
      { label: "Promotions", to: "/admin/promotions", icon: Megaphone },
    ],
  },
];

const AdminSideBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className=" h-screen flex flex-col shrink-0 bg-[#F5EDE3] border-r border-[#e8d8c8] w-16 md:w-64 transition-all duration-300">
      {/* Logo */}
      <Link to="/">
        <div className="px-3 md:px-6 pt-7 pb-6 flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#C8714A] flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-[#7a3f1e] font-bold text-base leading-tight">
              DoMasala
            </p>
            <p className="text-[#b08060] text-[11px] tracking-widest uppercase font-medium">
              Admin Portal
            </p>
          </div>
        </div>
      </Link>

      {/* Dashboard */}
      <div className="px-2 md:px-3 mb-1 md:mb-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-150
            ${
              isActive
                ? "bg-[#e8d0bc] text-[#7a3f1e]"
                : "text-[#8a6a50] hover:bg-[#ecddd0] hover:text-[#7a3f1e]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard
                className={`w-5 h-5 shrink-0 ${isActive ? "text-[#C8714A]" : "text-[#a08060]"}`}
              />
              <span className="hidden md:inline">Dashboard</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 md:px-3 space-y-1 md:space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="hidden md:block text-[10px] font-semibold tracking-widest text-[#b09070] uppercase px-3 mb-2 mt-4">
              {group.label}
            </p>

            <div className="block md:hidden my-1 mx-2 h-px bg-[#e0caba]" />

            <div className="space-y-0.5">
              {group.items.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={label}
                  className={({ isActive }) =>
                    `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[#e8d0bc] text-[#7a3f1e]"
                        : "text-[#8a6a50] hover:bg-[#ecddd0] hover:text-[#7a3f1e]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 shrink-0 ${isActive ? "text-[#C8714A]" : "text-[#a08060]"}`}
                      />
                      <span className="hidden md:inline">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 md:px-3 py-4 border-t border-[#e0caba]">
        <button
          onClick={handleLogout}
          title="Đăng xuất"
          className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 rounded-2xl text-sm font-medium text-[#8a6a50] hover:bg-red-50 hover:text-red-500 transition-colors duration-150 group"
        >
          <LogOut className="w-5 h-5 text-[#a08060] group-hover:text-red-400 shrink-0" />
          <span className="hidden md:inline">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
