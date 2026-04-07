import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import StarRating from "./StarRating";
import AddReviewForm from "./AddReviewForm";
import { useAuth } from "../context/AuthContext";

const ReviewSection = ({ foodId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // Fetch tất cả reviews + review của user
  useEffect(() => {
    if (!foodId) return;

    const fetchReviews = async () => {
      try {
        setFetchLoading(true);
        setFetchError("");
        setUserReview(null);

        const requests = [axios.get(`${API}/api/reviews/food/${foodId}`)];

        // Nếu đã đăng nhập thì fetch review của user luôn
        if (user) {
          requests.push(
            axios.get(`${API}/api/reviews/user-review/${user._id}/${foodId}`),
          );
        }

        const [reviewsRes, userReviewRes] = await Promise.allSettled(requests);

        if (reviewsRes.status === "fulfilled") {
          setReviews(reviewsRes.value.data?.data || []);
        }

        if (userReviewRes?.status === "fulfilled") {
          setUserReview(userReviewRes.value.data?.data || null);
        }
      } catch {
        setFetchError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchReviews();
  }, [foodId, user]);

  // Thêm review mới
  const handleAddReview = async ({ rating, comment, name }) => {
    try {
      setSubmitLoading(true);
      const { data } = await axios.post(`${API}/api/reviews/add`, {
        foodId,
        name,
        rating,
        comment,
      });
      setUserReview(data.data);
      setReviews((prev) => [data.data, ...prev]);
      toast.success("Đánh giá thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Cập nhật review
  const handleUpdateReview = async ({ rating, comment }) => {
    try {
      setSubmitLoading(true);
      const { data } = await axios.put(
        `${API}/api/reviews/update/${userReview._id}`,
        { rating, comment },
      );
      setUserReview(data.data);
      setReviews((prev) =>
        prev.map((r) => (r._id === userReview._id ? data.data : r)),
      );
      toast.success("Cập nhật đánh giá thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Xóa review
  const handleDeleteReview = async () => {
    try {
      setSubmitLoading(true);
      await axios.delete(`${API}/api/reviews/delete/${userReview._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== userReview._id));
      setUserReview(null);
      toast.success("Xóa đánh giá thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Lọc bỏ review của user khỏi danh sách chung (tránh hiện trùng)
  const otherReviews = reviews.filter((r) => r._id !== userReview?._id);
  const displayedReviews = showAll ? otherReviews : otherReviews.slice(0, 2);

  return (
    <div className="mt-16 mb-12 space-y-8">
      {/* Tiêu đề */}
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

      {/* Form thêm / hiển thị review của user */}
      <AddReviewForm
        existingReview={userReview}
        onSubmit={handleAddReview}
        onUpdate={handleUpdateReview}
        onDelete={handleDeleteReview}
        loading={submitLoading}
      />

      {/* Danh sách reviews */}
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

          {otherReviews.length > 2 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="flex items-center gap-2 text-primary-dull font-medium text-sm hover:opacity-75 transition cursor-pointer"
            >
              {showAll
                ? "Thu gọn"
                : `Xem tất cả ${otherReviews.length} đánh giá`}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;
