import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const AddReviewForm = ({
  onSubmit,
  onDelete,
  onUpdate,
  loading,
  existingReview,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
    setIsEditing(false);
  }, [existingReview]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!user) {
      toast.error(
        <span>
          Vui lòng
          <button
            onClick={() => navigate("/login")}
            className="underline font-semibold cursor-pointer"
          >
            đăng nhập
          </button>
          để gửi đánh giá!
        </span>,
      );
      return;
    }
    if (!rating) return toast.error("Vui lòng chọn số sao.");
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung đánh giá.");

    onSubmit({ rating, comment, name: user.name });
    setRating(0);
    setComment("");
  };

  const handleUpdate = () => {
    if (!rating) return toast.error("Vui lòng chọn số sao.");
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung đánh giá.");
    onUpdate({ rating, comment });
    setIsEditing(false);
  };

  // ── Đã có review ──────────────────────────────────────
  if (existingReview && !isEditing) {
    return (
      <div className="bg-[#F7F3EF] rounded-3xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 text-lg">
          Đánh giá của bạn
        </h3>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-dull flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {existingReview.name}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(existingReview.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Rating */}
        <StarRating
          rating={existingReview.rating}
          size="md"
          interactive={false}
        />

        {/* Comment */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {existingReview.comment}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setRating(existingReview.rating);
              setComment(existingReview.comment);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-dull transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Chỉnh sửa
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>
    );
  }

  // ── Form nhập / chỉnh sửa ─────────────────────────────
  return (
    <div className="bg-[#F7F3EF] rounded-3xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-700 text-lg">
        {isEditing ? "Chỉnh sửa đánh giá" : "Viết đánh giá của bạn"}
      </h3>

      {/* User info khi chưa có review */}
      {!isEditing && user && (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-dull flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-500 mb-2">Đánh giá chất lượng</p>
        <StarRating rating={rating} size="lg" interactive onRate={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
        className="w-full h-28 bg-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-dull resize-none text-sm"
      />

      <div className="flex gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 border border-gray-200 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
        )}
        <button
          onClick={isEditing ? handleUpdate : handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-primary-dull text-white rounded-full hover:opacity-90 transition text-sm font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Đang gửi..." : isEditing ? "Cập nhật" : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
};

export default AddReviewForm;
