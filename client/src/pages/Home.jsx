import { foods } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { BlurCircle } from "../components/BlurCircle";

const Home = () => {
  const navigate = useNavigate();
  const featuredFoods = foods.slice(0, 4);
  return (
    <main className="min-h-screen">
      <section className="relative px-6 md:px-16 lg:px-24 pt-32 pb-20 overflow-hidden">
        <BlurCircle top="50%" left="50%" size="480px" center />

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-lg">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
              Hương vị Ấn Độ
              <span className="italic text-primary-dull"> thư giãn </span>
              tại DoMasala
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Thưởng thức cà ri đậm đà và Masala Chai truyền thống trong một
              không gian yên bình, hiện đại.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                className="px-6 py-3 bg-primary-dull text-white rounded-full font-medium hover:bg-primary-dull/90 transition cursor-pointer"
                onClick={() => navigate("/menu")}
              >
                Khám phá Menu ngay
              </button>
              <button
                className="px-6 py-3 bg-[#EFE0CD] rounded-full font-medium hover:bg-[#e9e0d5] transition cursor-pointer"
                onClick={() => navigate("/reserve")}
              >
                Đặt bàn trực tuyến
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="aspect-4/5 rounded-3xl shadow-2xl max-w-md ml-auto relative">
              <img
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
                alt="Món đặc trưng"
                className="w-full h-full object-cover rounded-3xl "
              />
              <div className="absolute -bottom-4 -left-4 bg-white backdrop-blur py-4 px-5 rounded-4xl shadow-lg">
                <p className="text-md text-primary-dull font-semibold">
                  Món đặc trưng
                </p>
                <p className="text-xs text-gray-500">Butter Chicken Masala</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 py-20 bg-secondary/10">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="flex-1 max-w-sm">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl rotate-2">
              <img
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600"
                alt="Gia vị Ấn Độ"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <p className="text-sm text-primary-dull font-semibold uppercase tracking-widest mb-3">
              Câu chuyện của chúng tôi
            </p>
            <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-snug">
              Hành trình hương vị từ những hạt gia vị nhỏ nhất
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Tại DoMasala, chúng tôi không chỉ phục vụ thức ăn, chúng tôi mang
              đến trải nghiệm. Mỗi món ăn là sự kết tinh của hàng chục loại gia
              vị được chọn lọc cẩn thận.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Kết hợp cùng nước Masala Chai đậm nồng, chúng tôi tạo nên một
              "Thực đơn tâm trạng" — nơi bạn có thể trải nghiệm sự đa dạng của
              ẩm thực Ấn Độ.
            </p>

            <div className="flex gap-10">
              <div className="flex flex-col justify-center items-center">
                <p className="text-3xl font-bold text-primary-dull">100%</p>
                <p className="text-sm text-gray-400">Gia vị tự nhiên</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-3xl font-bold text-primary-dull">24h</p>
                <p className="text-sm text-gray-400">Ủ nước dùng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 lg:px-24 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Thực đơn đặc tuyển
          </h2>
          <div className="w-20 h-1 bg-secondary-dull mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 md:row-span-2 bg-white rounded-3xl overflow-hidden shadow-md flex flex-col">
            <div className="relative">
              <span className="absolute top-3 left-3 bg-primary-dull text-white text-xs px-3 py-1 rounded-full z-10">
                Được yêu thích nhất
              </span>
              <div className="aspect-4/3">
                <img
                  src={featuredFoods[0]?.image}
                  alt={featuredFoods[0]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {featuredFoods[0]?.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {featuredFoods[0]?.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary-dull">
                  {featuredFoods[0]?.price?.toLocaleString()}đ
                </p>
                <button className="px-4 py-2 bg-[#FEEFDB] text-primary-dull rounded-full text-sm font-medium hover:bg-primary-dull hover:text-white transition cursor-pointer">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {featuredFoods.slice(1, 3).map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-3xl overflow-hidden shadow-md flex gap-4 p-4 items-center"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {food.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {food.description}
                </p>
                <p className="text-primary-dull font-bold">
                  {food.price?.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}

          {featuredFoods[3] && (
            <div className="md:col-span-2 bg-[#FEEFDB] rounded-3xl overflow-hidden shadow-md flex gap-6 p-5 items-center">
              <div className="flex-1">
                <span className="text-xs text-primary-dull font-semibold uppercase tracking-widest">
                  Thức uống đặc trưng
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1 mb-2">
                  {featuredFoods[3].name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {featuredFoods[3].description}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-primary-dull">
                    {featuredFoods[3].price?.toLocaleString()}đ
                  </p>
                  <button className="px-4 py-2 bg-primary-dull text-white rounded-full text-sm font-medium hover:bg-primary-dull/90 transition cursor-pointer">
                    Thử ngay
                  </button>
                </div>
              </div>
              <div className="w-36 h-36 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={featuredFoods[3].image}
                  alt={featuredFoods[3].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-6 md:mx-16 lg:mx-24 mb-20 bg-primary-dull rounded-3xl px-10 py-16 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative">
          Khởi đầu hành trình vị giác của bạn
        </h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto relative">
          Đừng bỏ lỡ những khoảnh khắc ẩm thực bên bàn ăn. Hãy đặt chỗ trước để
          chúng tôi chuẩn bị bàn tốt nhất cho bạn.
        </p>
        <button
          className="px-8 py-3 bg-secondary-dull text-[#512305] rounded-full font-semibold hover:bg-secondary-dull/60 transition relative z-50 cursor-pointer"
          onClick={() => navigate("/reserve")}
        >
          Đặt bàn ngay hôm nay
        </button>
        <BlurCircle
          bottom="-130px"
          left="-130px"
          size="300px"
          blur={false}
          color="bg-white/5"
          index={0}
        />
        <BlurCircle
          right="-100px"
          top="-100px"
          size="200px"
          blur={false}
          color="bg-white/10"
          index={0}
        />
      </section>
    </main>
  );
};

export default Home;
