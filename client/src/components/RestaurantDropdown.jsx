import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, MapPin } from "lucide-react";

const RestaurantDropdown = ({ restaurants, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const selected = restaurants.find((r) => r._id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block mb-2 font-medium text-gray-600">
        CHỌN CƠ SỞ NHÀ HÀNG
      </label>

      <div
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-between gap-3 bg-[#E3E2E0] rounded-full px-5 py-3 cursor-pointer hover:bg-[#d5d4d2] transition-colors duration-200"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-[#7a4a2a] shrink-0" />
          <span
            className={`text-sm truncate ${selected ? "text-gray-800" : "text-gray-400"}`}
          >
            {selected ? selected.address : "-- Chọn cơ sở --"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`absolute top-[calc(100%+6px)] left-0 right-0 z-20 bg-white rounded-2xl border border-black/[0.07] shadow-sm overflow-hidden transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {restaurants.map((r, i) => (
          <div
            key={r._id}
            onMouseDown={() => {
              onChange(r._id);
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-150
              ${r._id === value ? "bg-[#F5EEE7]" : "hover:bg-[#faf8f5]"}
              ${i !== restaurants.length - 1 ? "border-b border-black/5" : ""}
            `}
            style={{
              transitionDelay: isOpen ? `${i * 40}ms` : "0ms",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-6px)",
              transition: `opacity 0.2s ease ${i * 40}ms, transform 0.2s ease ${i * 40}ms, background-color 0.15s`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-[#EFE0CD] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#7a4a2a]" />
            </div>
            <span className="text-sm text-gray-700 flex-1">{r.address}</span>
            {r._id === value && (
              <Check className="w-4 h-4 text-[#7a4a2a] shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDropdown;
