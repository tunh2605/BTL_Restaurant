import { useState, useRef } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  UtensilsCrossed,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { useFood } from "../../context/FoodContext";
import CategoryCard from "./CategoryCard";
import AddCategoryForm from "./AddCategoryForm";
import toast from "react-hot-toast";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import UpdateCategoryForm from "./UpdateCategoryForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ isAvailable }) => (
  <div className="flex items-center gap-1.5">
    <span
      className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-300"}`}
    />
    <span
      className={`text-sm ${isAvailable ? "text-gray-700" : "text-gray-400"}`}
    >
      {isAvailable ? "Đang bán" : "Hết hàng"}
    </span>
  </div>
);

const CATEGORY_COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
];

const CategoryPill = ({ name, index }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}`}
  >
    {name}
  </span>
);

// modal.type: null | "add" | "update" | "delete"
const MODAL_CLOSED = { type: null, data: null };
const ListFoodContent = ({ isHQAdmin = true }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const [modal, setModal] = useState(MODAL_CLOSED);
  const navigate = useNavigate();

  const scrollRef = useRef();
  const {
    foods = [],
    categories = [],
    loading,
    fetchFoods,
    refreshCategories,
  } = useFood();

  useEffect(() => {
    fetchFoods();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  const openModal = (type, data = null) => setModal({ type, data });

  const closeModal = () => setModal(MODAL_CLOSED);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setVisibleCount(4);
    fetchFoods(categoryId === "all" ? "" : categoryId);
  };

  const handleConfirmDelete = async () => {
    if (!modal.data) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/categories/delete/${modal.data._id}`,
      );
      toast.success(data.message);
      await Promise.all([refreshCategories(), fetchFoods()]);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleDeleteFood = async () => {
    if (!modal.data) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/foods/delete/${modal.data._id}`,
      );
      toast.success(data.message);
      await fetchFoods();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const visibleFoods = foods.slice(0, visibleCount);

  return (
    <>
      <div className="space-y-8">
        {/* ── Danh mục ── */}
        <div className="bg-[#faf7f4] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary-dull" />
              <h2 className="text-lg font-bold text-gray-800">
                Danh Mục Hiện Có
              </h2>
            </div>
            {isHQAdmin && (
              <button
                className="flex items-center gap-1.5 text-sm font-medium text-primary-dull hover:text-primary-dull/70 transition-colors"
                onClick={() => openModal("add")}
              >
                <Plus className="w-4 h-4" />
                Thêm danh mục
              </button>
            )}
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-8 py-4 animate-fadeIn"
            >
              {categories.map((cat, i) => (
                <div
                  key={cat._id}
                  className="min-w-50 shrink-0"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CategoryCard
                    category={cat}
                    foodCount={cat.foodCount}
                    isHQAdmin={isHQAdmin}
                    index={i}
                    onDelete={(cat) => {
                      openModal("deleteCategory", cat);
                    }}
                    onEdit={(cat) => openModal("update", cat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Danh sách món ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary-dull" />
              <h2 className="text-lg font-bold text-gray-800">
                Danh Sách Món Ăn
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[{ _id: "all", name: "Tất cả" }, ...categories].map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat._id
                      ? "bg-gray-800 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100 px-2">
            <div className="col-span-5">Món ăn</div>
            <div className="col-span-2">Danh mục</div>
            <div className="col-span-2">Giá (VNĐ)</div>
            <div className="col-span-2">Trạng thái</div>
            {isHQAdmin && <div className="col-span-1 text-right">Thao tác</div>}
          </div>

          <div className="divide-y divide-gray-50">
            {visibleFoods.map((food, i) => (
              <div
                key={food._id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="grid grid-cols-12 items-center py-4 px-2 hover:bg-[#faf7f4] rounded-xl transition-all duration-200 animate-fadeIn group"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {food.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {(food.description || "").slice(0, 35)}...
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <CategoryPill
                    name={food.category?.name || ""}
                    index={categories.findIndex(
                      (c) => c._id === (food.category?._id || food.category),
                    )}
                  />
                </div>

                <div className="col-span-2 font-semibold text-gray-700">
                  {food.price.toLocaleString("vi-VN")}
                </div>

                <div className="col-span-2">
                  <StatusBadge isAvailable={food.isAvailable} />
                </div>

                {isHQAdmin && (
                  <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      onClick={() => navigate(`/admin/foods/edit/${food._id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("deleteFood", food)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleCount < foods.length && (
            <button
              onClick={() => setVisibleCount((v) => v + 4)}
              className="w-full mt-4 py-3 text-sm font-semibold text-primary-dull hover:text-primary-dull/70 flex items-center justify-center gap-1.5 transition-colors"
            >
              Xem thêm món ăn
              <ChevronDown
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      <AddCategoryForm open={modal.type === "add"} onClose={closeModal} />

      <UpdateCategoryForm
        open={modal.type === "update"}
        onClose={closeModal}
        category={modal.data}
      />

      <ConfirmModal
        open={modal.type === "deleteCategory"}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục?"
        description={`Bạn có chắc muốn xóa "${modal.data?.name}" không?`}
      />

      <ConfirmModal
        open={modal.type === "deleteFood"}
        onClose={closeModal}
        onConfirm={handleDeleteFood}
        title="Xóa món ăn?"
        description={`Bạn có chắc muốn xóa "${modal.data?.name}" không?`}
      />
    </>
  );
};

export default ListFoodContent;
