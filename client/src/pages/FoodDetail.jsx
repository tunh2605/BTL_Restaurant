import {
  ArrowLeft,
  BadgeDollarSignIcon,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ReviewSection from "../components/ReviewSection";
import RestaurantDropdown from "../components/RestaurantDropdown";
import { useFood } from "../context/FoodContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const FoodDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { foods, restaurants, loading } = useFood();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [branch, setBranch] = useState("");

  const food = foods.find((f) => f._id === id);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dull" />
      </div>
    );

  if (!food)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Không tìm thấy món ăn</p>
      </div>
    );

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (!branch) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          foodId: food._id,
          restaurantId: branch,
          quantity: Number(quantity),
        },
      );

      // Nếu khác nhà hàng → hỏi người dùng
      if (data.code === "DIFFERENT_RESTAURANT") {
        const confirm = window.confirm(
          "Giỏ hàng đang có món từ nhà hàng khác. Bạn có muốn xóa và đặt lại không?",
        );
        if (confirm) {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`);
          await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
            foodId: food._id,
            restaurantId: branch,
            quantity: Number(quantity),
          });
          toast.success("Đã thêm vào giỏ hàng");
        }
        return;
      }

      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm vào giỏ thất bại");
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-30">
      <div className="flex gap-3 items-center mb-6">
        <ArrowLeft
          className="w-5 h-5 text-primary-dull cursor-pointer"
          onClick={() => navigate("/menu")}
        />
        <Breadcrumb />
      </div>

      <form className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 flex justify-center">
          <div className="aspect-4/5 w-full max-w-md rounded-3xl shadow-xl relative">
            <img
              src={food.image}
              alt="food"
              className="w-full h-full object-cover rounded-3xl "
            />

            <div className="absolute -bottom-4 -right-4 bg-secondary-dull py-4 px-6 rounded-full shadow-lg">
              <p className="text-lg italic font-semibold text-[#512305]">
                {food?.price / 1000}k
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
            {food?.name}
          </h1>

          <p className="text-gray-500 leading-relaxed">{food?.description}</p>

          <div className="space-y-5">
            <RestaurantDropdown
              restaurants={restaurants}
              value={branch}
              onChange={setBranch}
            />

            <div className="flex md:flex-row flex-col gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-600 ">
                  SỐ LƯỢNG
                </label>
                <div className="flex items-center justify-between bg-[#E3E2E0] rounded-full gap-0.5">
                  <button
                    type="button"
                    className={`p-4 rounded-full ${
                      quantity === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "text-[#512305]"
                    }`}
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        setQuantity("");
                        return;
                      }

                      const num = Number(value);

                      if (!isNaN(num) && num >= 1) {
                        setQuantity(num);
                      }
                    }}
                    onBlur={() => {
                      if (!quantity || quantity < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="no-spinner w-16 text-center bg-transparent outline-none font-bold"
                  />

                  <button
                    type="button"
                    className="p-4 bg-primary-dull text-white rounded-full"
                    onClick={() => setQuantity((prev) => Number(prev) + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="w-full">
                <label className="block mb-2 font-medium text-gray-700 overflow-hidden">
                  GHI CHÚ
                </label>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: ít cay, không hành..."
                  className="w-full h-48 bg-[#E3E2E0] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-dull resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap pt-4">
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-3 bg-primary-dull text-white rounded-full hover:opacity-90 transition"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              Thêm vào giỏ
            </button>

            <button
              type="button"
              className="flex items-center gap-3 px-6 py-3 bg-[#EFE0CD] rounded-full hover:bg-[#e9e0d5] transition"
            >
              <BadgeDollarSignIcon className="w-5 h-5" />
              Mua ngay
            </button>
          </div>
        </div>
      </form>
      <ReviewSection />
    </div>
  );
};

export default FoodDetail;
