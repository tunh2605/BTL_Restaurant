import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const userId = req.user.id;

    const existing = await Review.findOne({ user: userId, food: foodId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this food",
      });
    }

    const user = await User.findById(userId).select("name avatar");

    const review = new Review({
      user: userId,
      food: foodId,
      name: user.name,
      avatar: user.avatar,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating review", error });
  }
};

export const getReviewFoodByUserId = async (req, res) => {
  try {
    const { userId, foodId } = req.params;
    const review = await Review.findOne({ user: userId, food: foodId });
    if (!review) {
      return res.status(200).json({ success: true, data: review || null });
    } else {
      res.status(200).json({ success: true, data: review });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching review", error });
  }
};

export const getReviewsByFoodId = async (req, res) => {
  try {
    const { foodId } = req.params;
    const reviews = await Review.find({ food: foodId }).populate(
      "user",
      "name avatar",
    );
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fatching reviews", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const review = await Review.findById(reviewId);

    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đánh giá" });

    // chỉ cho xóa review của chính mình hoặc admin
    if (review.user.toString() !== userId && req.user.role !== "hqadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xóa" });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Đánh giá đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting review", error });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found!" });
    }

    if (review.user.toString() !== userId && req.user.role !== "hqadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền chỉnh sửa" });
    }

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật đánh giá", error });
  }
};
