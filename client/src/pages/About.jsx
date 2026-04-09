import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { useFood } from "../context/FoodContext";
import getOptimizedImage from "../libs/getOptimizedImage";

const About = () => {
  const { restaurants, fetchRestaurants, statsData, fetchStats } = useFood();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 md:px-16 lg:px-24 pt-40 pb-12 text-center overflow-hidden">
        <BlurCircle
          top="50%"
          left="50%"
          size="500px"
          center
          color="bg-primary/50"
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-primary/60 text-primary-dull rounded-full px-4 py-1 text-sm font-medium mb-4">
            Về chúng tôi
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Câu chuyện của
            <span className="text-primary-dull italic"> DoMasala</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            DoMasala được thành lập với tình yêu ẩm thực Ấn Độ chính thống. Từ
            những hạt gia vị thơm lừng đến từng món ăn được chế biến tỉ mỉ —
            chúng tôi mang đến không gian ẩm thực đậm đà, ấm áp và đáng nhớ.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-8">
            {[
              { label: "Chi nhánh", value: statsData?.total ?? "—" },
              { label: "Đang mở", value: statsData?.active ?? "—" },
              { label: "Nhân viên", value: statsData?.staffCount ?? "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-4 shadow-sm text-center"
              >
                <p className="text-2xl font-bold text-primary-dull">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant list */}
      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Hệ thống chi nhánh
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Chọn chi nhánh để xem hình ảnh và thông tin chi tiết
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/about/${r._id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:border-primary-dull hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-[#F5EDE3]">
                  {r.images?.[0]?.url ? (
                    <img
                      src={getOptimizedImage(r.images[0].url)}
                      alt={r.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-dull/40">
                      <MapPin className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="font-semibold text-gray-800 mb-2">{r.name}</p>
                  <p className="text-sm text-gray-400 flex items-start gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary-dull" />
                    {r.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        r.isOpen
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {r.isOpen ? "Đang mở" : "Tạm đóng"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {r.openTime} – {r.closeTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
