import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock, ChevronLeft, X } from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // url ảnh đang xem

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API}/api/restaurants/${id}`);
        setRestaurant(data.data);
      } catch {
        navigate("/about");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-dull border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!restaurant) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 md:px-16 lg:px-24 pt-40 pb-10 overflow-hidden">
        <BlurCircle
          top="50%"
          left="50%"
          size="500px"
          center
          color="bg-primary/50"
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/about")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-dull transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
                  restaurant.isOpen
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {restaurant.isOpen ? "Đang mở cửa" : "Tạm đóng"}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                {restaurant.name}
              </h1>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: MapPin, text: restaurant.address },
                { icon: Phone, text: restaurant.phone },
                {
                  icon: Clock,
                  text: `${restaurant.openTime} – ${restaurant.closeTime}`,
                },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
                >
                  <Icon className="w-3.5 h-3.5 text-primary-dull" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Hình ảnh ({restaurant.images?.length ?? 0})
          </h2>

          {restaurant.images?.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 shadow-sm">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              Chưa có hình ảnh
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {restaurant.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(img.url)}
                  className="aspect-square rounded-2xl overflow-hidden bg-[#F5EDE3] cursor-pointer hover:opacity-90 transition"
                >
                  <img
                    src={img.url}
                    alt={`${restaurant.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox}
            alt="preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
