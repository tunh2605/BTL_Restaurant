import { CircleAlert, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const categorySlug = food.category?.slug;
  return (
    <div className="rounded-3xl overflow-hidden p-4 bg-white/80 hover:-translate-y-2 transition-all">
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
      <div className="flex flex-col md:flex-row gap-2 p-3">
        <button
          className="flex items-center justify-center gap-1.5 w-full md:w-auto px-6 py-2.5 rounded-full bg-[#D2C4B2] font-medium hover:bg-[#e0d7ca] transition text-sm"
          onClick={() => navigate(`/menu/${categorySlug}/${food._id}`)}
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm
        </button>

        <button
          className="flex items-center justify-center gap-1.5 w-full md:w-auto px-6 py-2.5 rounded-full border-2 border-[#D2C4B2] font-medium hover:bg-[#D2C4B2] transition text-sm"
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
