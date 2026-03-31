import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  User,
  FileText,
  CheckCircle,
  ChevronRight,
  MapPin,
  Utensils,
} from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

const STEPS = ["Thông tin", "Chọn ngày giờ", "Xác nhận"];

const Reserve = () => {
  const { user, isLoggedIn } = useAuth();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    date: "",
    time: "",
    numberOfPeople: 2,
    note: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.phone.trim();
    if (step === 1) return form.date && form.time;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reservations`, {
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        numberOfPeople: form.numberOfPeople,
        note: form.note,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt bàn thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
        <BlurCircle top="20%" left="10%" size="300px" color="bg-primary/40" />
        <BlurCircle bottom="10%" right="5%" size="250px" color="bg-secondary/60" />
        <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-slideUp">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt bàn thành công!</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Chúng tôi đã nhận được yêu cầu của bạn và sẽ xác nhận qua điện thoại sớm nhất.
          </p>
          <div className="bg-[#F5EDE3] rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="w-4 h-4 text-primary-dull shrink-0" />
              <span className="font-medium">{form.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-primary-dull shrink-0" />
              <span>{form.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-primary-dull shrink-0" />
              <span>{new Date(form.date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-primary-dull shrink-0" />
              <span>{form.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-4 h-4 text-primary-dull shrink-0" />
              <span>{form.numberOfPeople} người</span>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm({ name: user?.name || "", phone: user?.phone || "", date: "", time: "", numberOfPeople: 2, note: "" }); }}
            className="w-full py-3 bg-primary-dull text-white rounded-full font-semibold hover:bg-primary-dull/90 transition cursor-pointer"
          >
            Đặt bàn khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero section */}
      <section className="relative px-6 md:px-16 lg:px-24 pt-36 pb-16 overflow-hidden">
        <BlurCircle top="50%" left="50%" size="500px" center color="bg-primary/50" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-block bg-primary/60 text-primary-dull rounded-full px-4 py-1 text-sm font-medium mb-4">
            Trải nghiệm đặc biệt
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
            Đặt bàn tại{" "}
            <span className="text-primary-dull italic">DoMasala</span>
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
            Hãy để chúng tôi chuẩn bị một trải nghiệm ẩm thực Ấn Độ tuyệt vời cho bạn và những người thân yêu.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="px-6 md:px-16 lg:px-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: MapPin, title: "Địa chỉ", desc: "123 Đường Hương Vị, Q.1, TP.HCM" },
            { icon: Clock, title: "Giờ mở cửa", desc: "10:00 – 22:00 mỗi ngày" },
            { icon: Phone, title: "Hotline", desc: "0901 234 567" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FEEFDB] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary-dull" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-sm text-gray-700 font-semibold mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < step
                        ? "bg-primary-dull text-white"
                        : i === step
                        ? "bg-primary-dull text-white ring-4 ring-primary/40"
                        : "bg-[#E3E2E0] text-gray-400"
                    }`}
                  >
                    {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${i === step ? "text-primary-dull" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-1 mb-5 transition-all duration-300 ${i < step ? "bg-primary-dull" : "bg-[#E3E2E0]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 animate-fadeIn" key={step}>

            {/* Step 0: Thông tin */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Thông tin khách hàng</h2>
                  <p className="text-sm text-gray-400">Vui lòng cung cấp thông tin để chúng tôi liên hệ xác nhận.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 bg-[#F5EDE3] rounded-2xl px-4 py-3.5">
                    <User className="w-4 h-4 text-primary-dull shrink-0" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 bg-[#F5EDE3] rounded-2xl px-4 py-3.5">
                    <Phone className="w-4 h-4 text-primary-dull shrink-0" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="0901 234 567"
                      className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Số người
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {PARTY_SIZES.map((n) => (
                      <button
                        key={n}
                        onClick={() => handleChange("numberOfPeople", n)}
                        className={`py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          form.numberOfPeople === n
                            ? "bg-primary-dull text-white shadow-md"
                            : "bg-[#F5EDE3] text-gray-600 hover:bg-primary/60"
                        }`}
                      >
                        <span className="block">{n}</span>
                        <span className="block text-xs opacity-70 mt-0.5">
                          {n === 1 ? "người" : "người"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Ghi chú
                  </label>
                  <div className="flex gap-3 bg-[#F5EDE3] rounded-2xl px-4 py-3.5">
                    <FileText className="w-4 h-4 text-primary-dull shrink-0 mt-0.5" />
                    <textarea
                      value={form.note}
                      onChange={(e) => handleChange("note", e.target.value)}
                      placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm, dịp kỷ niệm..."
                      rows={3}
                      className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Chọn ngày giờ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Chọn ngày & giờ</h2>
                  <p className="text-sm text-gray-400">Chọn thời gian phù hợp để chúng tôi chuẩn bị tốt nhất.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Ngày đặt bàn <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 bg-[#F5EDE3] rounded-2xl px-4 py-3.5">
                    <Calendar className="w-4 h-4 text-primary-dull shrink-0" />
                    <input
                      type="date"
                      value={form.date}
                      min={today}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="bg-transparent flex-1 text-sm outline-none text-gray-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Giờ đến <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleChange("time", t)}
                        className={`py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          form.time === t
                            ? "bg-primary-dull text-white shadow-md"
                            : "bg-[#F5EDE3] text-gray-600 hover:bg-primary/60"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Xác nhận */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Xác nhận đặt bàn</h2>
                  <p className="text-sm text-gray-400">Kiểm tra lại thông tin trước khi gửi yêu cầu.</p>
                </div>

                <div className="bg-[#F5EDE3] rounded-2xl p-6 space-y-4">
                  {[
                    { icon: User, label: "Khách hàng", value: form.name },
                    { icon: Phone, label: "Điện thoại", value: form.phone },
                    {
                      icon: Calendar,
                      label: "Ngày",
                      value: new Date(form.date).toLocaleDateString("vi-VN", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                      }),
                    },
                    { icon: Clock, label: "Giờ đến", value: form.time },
                    { icon: Users, label: "Số người", value: `${form.numberOfPeople} người` },
                    ...(form.note ? [{ icon: FileText, label: "Ghi chú", value: form.note }] : []),
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary-dull" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-sm text-gray-700 font-semibold mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <Utensils className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Sau khi đặt bàn, nhân viên DoMasala sẽ gọi điện xác nhận trong vòng 30 phút. Bàn sẽ được giữ trong 15 phút kể từ giờ đặt.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-3.5 rounded-full border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Quay lại
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => canNext() && setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="flex-1 py-3.5 rounded-full bg-primary-dull text-white font-semibold hover:bg-primary-dull/90 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  Tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-full bg-primary-dull text-white font-semibold hover:bg-primary-dull/90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Đang gửi..." : "Xác nhận đặt bàn"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reserve;
