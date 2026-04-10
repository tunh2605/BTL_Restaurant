import { useNavigate, useParams } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import { UtensilsCrossed } from "lucide-react";
import { useFood } from "../context/FoodContext";
import { BlurCircle } from "../components/BlurCircle";

const Menu = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { foods, categories, loading } = useFood();

  const selectedCategory = categories.find((c) => c.slug === category);

  const filteredFoods =
    !category || category === "tat-ca"
      ? foods
      : foods.filter(
          (f) =>
            f.category?._id?.toString() === selectedCategory?._id?.toString(),
        );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary-dull border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-6 md:px-16 lg:px-24 pt-40 w-full">
      <BlurCircle
        top="25%"
        left="50%"
        size="500px"
        center
        color="bg-primary/50"
      />
      <div className="flex justify-between items-center w-full flex-col">
        <p className="bg-primary/60 rounded-full px-4 py-0.5 text-primary-dull">
          Hương vị bản địa
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 p-8">
          <h1 className="text-6xl font-bold">Thực đơn</h1>
          <h1 className="text-6xl font-bold text-primary-dull italic">
            DoMasala
          </h1>
        </div>

        <p className="text-center text-gray-500 max-w-xl mx-auto">
          Khám phá hành trình vị giác xuyên lục địa với những nguyên liệu sạch
          nhất, gia vị thủ công và kỹ thuật nấu nướng truyền thống đầy cảm hứng.
        </p>
      </div>

      {/* Category buttons */}
      <div className="flex gap-3 mt-10 overflow-x-auto justify-center items-center">
        <button
          onClick={() => navigate("/menu")}
          className={`px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
            !category || category === "tat-ca"
              ? "bg-primary-dull text-white border-primary-dull"
              : " bg-[#E3E2E0]"
          }`}
        >
          Tất cả
        </button>

        {categories.map((cate, index) => (
          <button
            key={index}
            onClick={() => navigate(`/menu/${cate.slug}`)}
            className={`px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
              category === cate.slug
                ? "bg-primary-dull text-white border-primary-dull"
                : " bg-[#E3E2E0]"
            }`}
          >
            {cate.name}
          </button>
        ))}
      </div>

      {/* Food list */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredFoods.map((food, i) => (
            <FoodCard food={food} key={food._id} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <div className="w-24 h-24 rounded-full bg-[#FEEFDB] flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-primary-dull" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">
            Chưa có món ăn nào
          </h2>
          <p className="text-gray-400 max-w-sm">
            Thực đơn đang được cập nhật. Vui lòng quay lại sau.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
