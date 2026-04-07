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
  <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
    <div className="w-16 h-16 rounded-2xl bg-[#f5ede6] flex items-center justify-center text-3xl">
      {categoryIcons[index % categoryIcons.length]}
    </div>
    <div className="text-center">
      <p className="font-semibold text-gray-800">{category.name}</p>
      <p className="text-sm text-gray-400">{foodCount} món ăn</p>
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
