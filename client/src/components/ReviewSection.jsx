import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { dummyReviews } from "../assets/assets";
import StarRating from "./StarRating";
import AddReviewForm from "./AddReviewForm";

const ReviewSection = ({ foodId }) => {
  const [reviews, setReviews] = useState(
    dummyReviews.filter((r) => r.food == foodId), // sử dụng dữ liệu mẫu, sau đổi lại thành [] để fetch
  );
  const [showAll, setShowAll] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false); // sau set thành true
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // fetch reviews theo foodId
  // useEffect(() => {
  //   if (!foodId) return;

  //   const fetchReviews = async () => {
  //     try {
  //       setFetchLoading(true);
  //       setFetchError("");
  //       const { data } = await axios.get(`/api/reviews?food=${foodId}`);
  //       setReviews(data); // API trả về mảng Review[]
  //     } catch (err) {
  //       setFetchError("Không thể tải đánh giá. Vui lòng thử lại sau.");
  //     } finally {
  //       setFetchLoading(false);
  //     }
  //   };

  //   fetchReviews();
  // }, [foodId]);

  // gửi review mới
  const handleAddReview = async ({ rating, comment, name }) => {
    try {
      setSubmitLoading(true);
      const { data } = await axios.post("/api/reviews", {
        food: foodId,
        name,
        rating,
        comment,
      });
      // thêm review mới lên đầu danh sách
      setReviews((prev) => [data, ...prev]);
    } catch (err) {
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

  return (
    <div className="mt-16 mb-12 space-y-8">
      {/* tiêu đề + tổng số sao */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Đánh giá từ cộng đồng
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(averageRating)} size="md" />
            <span className="text-gray-500 text-sm">
              {averageRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* trạng thái loading / lỗi / rỗng */}
      {fetchLoading ? (
        <p className="text-gray-400 text-sm">Đang tải đánh giá...</p>
      ) : fetchError ? (
        <p className="text-red-400 text-sm">{fetchError}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <>
          {/* Danh sách review */}
          <div className="space-y-5">
            {displayedReviews.map((review) => (
              <div
                key={review._id}
                className="flex gap-4 p-5 bg-[#FAF8F5] rounded-2xl"
              >
                <img
                  src={
                    review.avatar || `https://i.pravatar.cc/48?u=${review._id}`
                  }
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">
                        {review.name}
                      </span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* nút xem thêm */}
          {reviews.length > 2 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="flex items-center gap-2 text-primary-dull font-medium text-sm hover:opacity-75 transition"
            >
              {showAll ? "Thu gọn" : `Xem tất cả ${reviews.length} đánh giá`}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </>
      )}

      {/* form thêm đánh giá */}
      <AddReviewForm onSubmit={handleAddReview} loading={submitLoading} />
    </div>
  );
};

export default ReviewSection;
