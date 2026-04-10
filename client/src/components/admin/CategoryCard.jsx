import { Pencil, Trash2 } from "lucide-react";

const categoryIcons = ["🍛", "🫓", "🥤", "🍮", "🍜", "🥗", "🍰", "🧃"];

const CategoryCard = ({
  category,
  foodCount,
  isHQAdmin,
  index,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group w-32 sm:w-40 lg:w-auto">
    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-[#f5ede6] flex items-center justify-center text-2xl sm:text-3xl">
      {categoryIcons[index % categoryIcons.length]}
    </div>
    <div className="text-center min-w-0">
      <p className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base truncate w-full px-1">{category.name}</p>
      <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">{foodCount} món ăn</p>
    </div>
    {isHQAdmin && (
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit?.(category)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            onDelete?.(category);
          }}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

export default CategoryCard;
