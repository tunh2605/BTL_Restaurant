import { useState } from "react";
import StarRating from "./StarRating";

const AddReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!rating) return setError("Vui lòng chọn số sao.");
    if (!name.trim()) return setError("Vui lòng nhập tên của bạn.");
    if (!comment.trim()) return setError("Vui lòng nhập nội dung đánh giá.");

    setError("");
    onSubmit({ rating, comment, name });
    setRating(0);
    setComment("");
    setName("");
  };

  return (
    <div className="bg-[#F7F3EF] rounded-3xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-700 text-lg">
        Viết đánh giá của bạn
      </h3>

      <div>
        <p className="text-sm text-gray-500 mb-2">Đánh giá chất lượng</p>
        <StarRating rating={rating} size="lg" interactive onRate={setRating} />
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên của bạn"
        className="w-full bg-white rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-primary-dull text-sm"
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
        className="w-full h-28 bg-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-dull resize-none text-sm"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 bg-primary-dull text-white rounded-full hover:opacity-90 transition text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
};

export default AddReviewForm;
