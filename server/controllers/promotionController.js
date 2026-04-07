import Promotion from "../models/Promotion.js";
import PromotionFood from "../models/PromotionFood.js";
import PromotionUsage from "../models/PromotionUsage.js";

const isExpired = (p) => p.endDate && new Date() > new Date(p.endDate);
const isNotStarted = (p) => p.startDate && new Date() < new Date(p.startDate);

export const getPromotions = async (req, res) => {
  try {
    const { restaurantId, type, isActive } = req.query;

    const filter = {};
    if (restaurantId) {
      filter.restaurants = { $in: [restaurantId] };
    }
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const promotions = await Promotion.find(filter)
      .populate("restaurants", "name address")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: promotions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "restaurants",
      "name address",
    );

    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khuyến mãi" });
    }

    let foods = [];
    if (promotion.type === "food") {
      foods = await PromotionFood.find({
        promotion: promotion._id,
      }).populate("food", "name price images");
    }

    res.json({
      success: true,
      data: { ...promotion.toObject(), foods },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const {
      name,
      restaurants,
      type,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      minOrderValue,
      maxDiscount,
      usageLimit,
      foodIds,
    } = req.body;

    if (!name || !type || !discountType || discountValue == null) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    if (
      !restaurants ||
      (Array.isArray(restaurants) && restaurants.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phải chọn ít nhất 1 nhà hàng",
      });
    }

    if (
      discountType === "percent" &&
      (discountValue <= 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phần trăm giảm phải từ 1–100",
      });
    }

    const promotion = await Promotion.create({
      name: name.trim(),
      restaurants: Array.isArray(restaurants) ? restaurants : [restaurants],
      type,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      usedCount: 0,
    });

    // mapping food
    if (type === "food" && Array.isArray(foodIds) && foodIds.length > 0) {
      await PromotionFood.insertMany(
        foodIds.map((foodId) => ({
          promotion: promotion._id,
          food: foodId,
        })),
      );
    }

    res.status(201).json({
      success: true,
      message: "Tạo khuyến mãi thành công",
      data: promotion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { foodIds, restaurants, ...rest } = req.body;

    const updateData = {
      ...rest,
      ...(restaurants && {
        restaurants: Array.isArray(restaurants) ? restaurants : [restaurants],
      }),
    };

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khuyến mãi" });
    }

    if (promotion.type === "food" && Array.isArray(foodIds)) {
      await PromotionFood.deleteMany({ promotion: promotion._id });

      if (foodIds.length > 0) {
        await PromotionFood.insertMany(
          foodIds.map((foodId) => ({
            promotion: promotion._id,
            food: foodId,
          })),
        );
      }
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: promotion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khuyến mãi" });
    }

    await PromotionFood.deleteMany({ promotion: req.params.id });

    res.json({
      success: true,
      message: "Xoá khuyến mãi thành công",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const applyPromotion = async (req, res) => {
  try {
    const { promotionId, orderValue, items, restaurantId } = req.body;

    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "Khuyến mãi không tồn tại" });
    }

    if (
      restaurantId &&
      !promotion.restaurants?.some((r) => r.toString() === restaurantId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi không áp dụng cho cửa hàng này",
      });
    }

    if (!promotion.isActive)
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi đã ngừng hoạt động",
      });

    if (isNotStarted(promotion))
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi chưa bắt đầu",
      });

    if (isExpired(promotion))
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi đã hết hạn",
      });

    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Khuyến mãi đã hết lượt",
      });
    }

    if (orderValue < promotion.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Đơn tối thiểu ${promotion.minOrderValue.toLocaleString(
          "vi-VN",
        )}đ`,
      });
    }

    let discountBase = orderValue;

    if (promotion.type === "food") {
      const promoFoods = await PromotionFood.find({
        promotion: promotion._id,
      });

      const validFoodIds = promoFoods.map((f) => f.food.toString());

      const validItems = (items || []).filter((i) =>
        validFoodIds.includes(i.foodId.toString()),
      );

      if (validItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không có món nào áp dụng được mã này",
        });
      }

      discountBase = validItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    }

    let discountAmount =
      promotion.discountType === "percent"
        ? (discountBase * promotion.discountValue) / 100
        : promotion.discountValue;

    if (promotion.discountType === "percent" && promotion.maxDiscount) {
      discountAmount = Math.min(discountAmount, promotion.maxDiscount);
    }

    discountAmount = Math.min(discountAmount, orderValue);

    return res.json({
      success: true,
      data: {
        promotionId,
        discountAmount,
        finalAmount: orderValue - discountAmount,
        appliedOn: promotion.type === "food" ? "selected_items" : "full_order",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const confirmUsage = async (req, res) => {
  try {
    const { promotionId, orderId, discountAmount } = req.body;
    const userId = req.user._id;

    await Promise.all([
      PromotionUsage.create({
        promotion: promotionId,
        user: userId,
        order: orderId,
        discountAmount,
      }),
      Promotion.findByIdAndUpdate(promotionId, {
        $inc: { usedCount: 1 },
      }),
    ]);

    res.json({
      success: true,
      message: "Ghi nhận sử dụng thành công",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUsageHistory = async (req, res) => {
  try {
    const history = await PromotionUsage.find({
      promotion: req.params.promotionId,
    })
      .populate("user", "name email")
      .populate("order", "totalAmount createdAt")
      .sort({ usedAt: -1 });

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAvailablePromotions = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu restaurantId" });
    }

    const now = new Date();

    const promotions = await Promotion.find({
      restaurants: restaurantId,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
      ],
    }).sort({ createdAt: -1 });

    // với mỗi promotion type "food", query thêm PromotionFood
    const result = await Promise.all(
      promotions.map(async (promo) => {
        const obj = promo.toObject();

        if (promo.type === "food") {
          const foods = await PromotionFood.find({
            promotion: promo._id,
          }).populate("food", "_id name image");
          obj.foods = foods; // [{ promotion, food: { _id, name, image } }]
        }

        return obj;
      }),
    );

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
