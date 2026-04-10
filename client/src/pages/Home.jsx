import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Clock, Award, Heart } from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { FeaturedFoods } from "../assets/assets";
import getOptimizedImage from "../libs/getOptimizedImage";

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setShouldAnimate(true), 120);
    return () => clearTimeout(timer);
  }, [isInView]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, delayChildren = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setShouldAnimate(true), 120);
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FloatingBadge = ({ children, className = "" }) => (
  <motion.div
    className={className}
    style={{ willChange: "transform" }}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const featuredFoods = FeaturedFoods.slice(0, 4);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { icon: Award, label: "Năm kinh nghiệm", value: "10+" },
    { icon: Star, label: "Đánh giá 5 sao", value: "2K+" },
    { icon: Heart, label: "Khách hàng yêu thích", value: "15K+" },
  ];

  return (
    <main className="min-h-screen overflow-hidden" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <BlurCircle
          top="30%"
          left="10%"
          size="400px"
          color="bg-primary/30"
          className="pointer-events-none"
        />
        <BlurCircle
          bottom="20%"
          right="5%"
          size="300px"
          color="bg-secondary/40"
          className="pointer-events-none"
        />

        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            willChange: "transform, opacity",
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#FEEFDB]/20 via-transparent to-[#EFE0CD]/30" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-20 pb-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm mb-4"
              >
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-600">
                  Nhà hàng Ấn Độ hàng đầu
                </span>
              </motion.div>

              <FadeIn delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
                  Hương vị Ấn Độ
                  <span className="italic text-primary-dull">
                    {" "}
                    thư giãn
                  </span>{" "}
                  tại DoMasala
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-base text-gray-500 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Thưởng thức cà ri đậm đà và Masala Chai truyền thống trong một
                  không gian yên bình, hiện đại.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: "transform" }}
                    className="group px-5 py-2.5 bg-primary-dull text-white rounded-full font-medium hover:bg-primary-dull/90 transition-all shadow-md cursor-pointer"
                    onClick={() => navigate("/menu")}
                  >
                    Khám phá Menu
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: "transform" }}
                    className="px-5 py-2.5 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition border border-gray-200 cursor-pointer"
                    onClick={() => navigate("/reserve")}
                  >
                    Đặt bàn
                  </motion.button>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex gap-6 mt-8 justify-center lg:justify-start">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-center"
                    >
                      <stat.icon className="w-5 h-5 text-primary-dull mx-auto mb-1" />
                      <p className="text-xl font-bold text-gray-800">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ willChange: "transform, opacity" }}
                className="relative"
              >
                {/* Fixed aspect ratio wrapper để tránh CLS */}
                <div className="aspect-3/4 lg:aspect-auto rounded-2xl overflow-hidden shadow-xl shadow-primary-dull/20 lg:max-h-[85vh]">
                  <img
                    src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
                    alt="Món đặc trưng"
                    className="w-full h-full object-cover"
                    width={800}
                    height={1067}
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                </div>

                <FloatingBadge className="absolute -bottom-4 -left-4 bg-white backdrop-blur-lg py-4 px-5 rounded-2xl shadow-lg">
                  <p className="text-sm text-primary-dull font-bold">
                    Món đặc trưng
                  </p>
                  <p className="text-xs text-gray-500">Butter Chicken Masala</p>
                </FloatingBadge>

                <FloatingBadge
                  delay={1}
                  className="absolute -top-3 -right-3 bg-[#FEEFDB] py-2 px-3 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-800">4.9</span>
                  </div>
                </FloatingBadge>

                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{ willChange: "transform, opacity" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ willChange: "transform" }}
            className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1.5"
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ willChange: "transform, opacity" }}
              className="w-1 h-1 bg-gray-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-secondary/5 to-transparent" />

        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Image Side */}
            <div className="flex-1 relative">
              <FadeIn direction="left">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{ willChange: "transform" }}
                    className="aspect-square w-80 lg:w-106 mx-auto rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={getOptimizedImage(
                        "https://res.cloudinary.com/dee2rmdua/image/upload/v1775128601/hnrksizfoubz7epol95b.jpg",
                      )}
                      alt="Gia vị Ấn Độ"
                      className="w-full h-full object-cover"
                      width={600}
                      height={600}
                      loading="lazy"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ rotate: -5, scale: 1.05 }}
                    style={{ willChange: "transform" }}
                    className="absolute -bottom-3 right-0 bg-white p-3 rounded-xl shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary-dull" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">24h</p>
                        <p className="text-xs text-gray-400">Ủ nước dùng</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </FadeIn>
            </div>

            {/* Content Side */}
            <div className="flex-1 max-w-2xl">
              <FadeIn delay={0.1}>
                <span className="inline-block text-xs text-primary-dull font-semibold uppercase tracking-widest mb-3">
                  Câu chuyện của chúng tôi
                </span>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  Hành trình hương vị từ những{" "}
                  <span className="text-primary-dull italic">hạt gia vị</span>{" "}
                  nhỏ nhất
                </h2>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Tại DoMasala, chúng tôi không chỉ phục vụ thức ăn, chúng tôi
                  mang đến trải nghiệm. Mỗi món ăn là sự kết tinh của hàng chục
                  loại gia vị được chọn lọc cẩn thận từ vùng Kerala, Ấn Độ.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Kết hợp cùng nước Masala Chai đậm nồng, chúng tôi tạo nên một
                  "Thực đơn tâm trạng" — nơi bạn có thể trải nghiệm sự đa dạng
                  của ẩm thực Ấn Độ.
                </p>
              </FadeIn>

              <StaggerContainer delayChildren={0.5} className="flex gap-8">
                {[
                  { value: "100%", label: "Gia vị tự nhiên" },
                  { value: "50+", label: "Món ăn đặc sắc" },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5 },
                      },
                    }}
                    style={{ willChange: "transform, opacity" }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-primary-dull mb-0.5">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 lg:py-28 bg-linear-to-b from-transparent to-secondary/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <FadeIn className="text-center mb-10">
            <span className="inline-block text-xs text-primary-dull font-semibold uppercase tracking-widest mb-3">
              Thực đơn
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Thực đơn{" "}
              <span className="italic text-primary-dull">đặc tuyển</span>
            </h2>
            <div className="w-16 h-1 bg-linear-to-r from-primary-dull to-secondary-dull mx-auto rounded-full" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10 }}
              style={{ willChange: "transform, opacity" }}
              className="lg:col-span-1 lg:row-span-2 bg-white rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              <div className="relative overflow-hidden">
                {/* Fixed aspect ratio để tránh CLS */}
                <div className="aspect-4/3 relative">
                  <img
                    src={getOptimizedImage(featuredFoods[0]?.image)}
                    alt={featuredFoods[0]?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={600}
                    height={450}
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute top-3 left-3 bg-primary-dull text-white text-xs px-3 py-1 rounded-full font-medium"
                >
                  Được yêu thích nhất
                </motion.span>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring" }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </motion.div>
              </div>
              <div className="p-4 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {featuredFoods[0]?.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {featuredFoods[0]?.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary-dull">
                    {featuredFoods[0]?.price?.toLocaleString()}đ
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: "transform" }}
                    className="px-4 py-2 bg-[#FEEFDB] text-primary-dull rounded-full text-xs font-semibold hover:bg-primary-dull hover:text-white transition-all cursor-pointer"
                  >
                    Thêm vào giỏ
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Medium Cards */}
            {featuredFoods.slice(1, 3).map((food, index) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ willChange: "transform, opacity" }}
                className="bg-white rounded-xl overflow-hidden shadow-sm flex gap-4 p-3 items-center cursor-pointer"
                onClick={() => navigate("/menu")}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  style={{ willChange: "transform" }}
                  className="w-20 h-20 rounded-xl overflow-hidden shrink-0"
                >
                  <img
                    src={getOptimizedImage(food.image)}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    width={80}
                    height={80}
                    loading="lazy"
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                    {food.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {food.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-primary-dull">
                      {food.price?.toLocaleString()}đ
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ willChange: "transform" }}
                      className="w-8 h-8 bg-primary-dull rounded-full flex items-center justify-center text-white cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Drink Card */}
            {featuredFoods[3] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                style={{ willChange: "transform, opacity" }}
                className="md:col-span-2 bg-linear-to-r from-[#FEEFDB] to-[#EFE0CD] rounded-xl overflow-hidden shadow-sm flex gap-5 p-4 items-center cursor-pointer"
                onClick={() => navigate("/menu")}
              >
                <div className="flex-1">
                  <span className="text-xs text-primary-dull font-bold uppercase tracking-widest">
                    Thức uống đặc trưng
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">
                    {featuredFoods[3].name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-md">
                    {featuredFoods[3].description}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-primary-dull">
                      {featuredFoods[3].price?.toLocaleString()}đ
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ willChange: "transform" }}
                      className="px-4 py-2 bg-primary-dull text-white rounded-full text-xs font-semibold hover:bg-primary-dull/90 transition cursor-pointer"
                    >
                      Thử ngay
                    </motion.button>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{ willChange: "transform" }}
                  className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-md"
                >
                  <img
                    src={getOptimizedImage(featuredFoods[3].image)}
                    alt={featuredFoods[3].name}
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: "transform" }}
                onClick={() => navigate("/menu")}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-dull text-primary-dull rounded-full font-medium hover:bg-primary-dull hover:text-white transition-all cursor-pointer"
              >
                Xem tất cả menu
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ willChange: "transform, opacity" }}
          className="bg-primary-dull rounded-2xl px-8 md:px-12 py-12 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute -top-16 -right-16 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          />

          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Khởi đầu hành trình{" "}
                <span className="italic text-secondary-dull">vị giác</span> của
                bạn
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">
                Đừng bỏ lỡ những khoảnh khắc ẩm thực bên bàn ăn. Hãy đặt chỗ
                trước để chúng tôi chuẩn bị bàn tốt nhất cho bạn.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <motion.button
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: "transform" }}
                onClick={() => navigate("/reserve")}
                className="px-6 py-3 bg-secondary-dull text-[#512305] rounded-full font-semibold text-sm hover:bg-secondary-dull/90 transition-all shadow-lg cursor-pointer"
              >
                Đặt bàn ngay hôm nay
              </motion.button>
            </FadeIn>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;
