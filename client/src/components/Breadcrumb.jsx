import { useLocation, Link } from "react-router-dom";
import { useMemo } from "react";
import { foods, categories } from "../assets/assets";

const Breadcrumb = ({ customCrumbs }) => {
  const { pathname } = useLocation();

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    [],
  );

  const foodMap = useMemo(
    () => Object.fromEntries(foods.map((f) => [f._id, f.name])),
    [],
  );

  const nameMap = {
    menu: "Menu",
    cart: "Giỏ hàng",
    about: "Giới thiệu",
    contact: "Liên hệ",
    reserve: "Đặt bàn",
  };

  const getLabel = (seg) =>
    nameMap[seg] || categoryMap[seg] || foodMap[seg] || seg;

  const crumbs = customCrumbs || [
    { label: "Trang chủ", path: "/" },
    ...pathname
      .split("/")
      .filter(Boolean)
      .map((seg, index, arr) => ({
        label: getLabel(seg),
        path: "/" + arr.slice(0, index + 1).join("/"),
      })),
  ];

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500">
      {crumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {index < crumbs.length - 1 ? (
            <>
              <Link
                to={crumb.path}
                className="hover:text-primary-dull transition"
              >
                {crumb.label}
              </Link>
              <span>›</span>
            </>
          ) : (
            <span className="text-primary-dull font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
