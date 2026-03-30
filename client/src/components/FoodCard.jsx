import { CircleAlert, ShoppingCart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../assets/assets";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const categorySlug = categories.find((c) => c._id === food.category)?.slug;
  return (
    <div className="rounded-3xl overflow-hidden p-4 bg-white/80">
      <div className="aspect-4/3">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full rounded-4xl object-cover"
        />
      </div>
      <div className="p-3 overflow-hidden">
        <div className="flex justify-between mb-2">
          <div className="font-semibold truncate pr-2">{food.name}</div>
          <div className="text-primary-dull font-bold whitespace-nowrap">
            {food.price / 1000}k
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {food.description}
        </p>
      </div>

      <div className="flex justify-between gap-2 p-3 bottom-0">
        <button
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-full  bg-[#D2C4B2]  font-medium hover:bg-[#e0d7ca] transition cursor-pointer text-sm"
          onClick={() => navigate(`/menu/${categorySlug}/${food._id}`)}
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm
        </button>
        <button
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border-2 border-[#D2C4B2]  font-medium hover:bg-[#D2C4B2] transition cursor-pointer text-sm"
          onClick={() => navigate(`/menu/${categorySlug}/${food._id}`)}
        >
          <CircleAlert className="w-4 h-4" />
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
