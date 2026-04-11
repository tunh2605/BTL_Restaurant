import Food from "../models/Food.js";
import OrderItem from "../models/OrderItem.js";
import Order from "../models/Order.js";
import cloudinary from "../configs/cloudinary.js";

const FOOD_POPULATE = [{ path: "category" }, { path: "restaurants" }];

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Món ăn không tồn tại" });

export const addFood = async (req, res) => {
  try {
    const { name, image, description, price, category, restaurants } = req.body;
    // restaurants nhận vào array id: ["id1", "id2", ...]
    const food = await Food.create({
      name,
      image,
      description,
      price,
      category,
      restaurants,
    });

    res.status(201).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFoods = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    if (req.query.restaurant) filter.restaurants = req.query.restaurant;

    const foods = await Food.find(filter).populate(FOOD_POPULATE);

    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(FOOD_POPULATE);

    if (!food) return notFound(res);

    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { name, image, description, price, category, restaurants } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, image, description, price, category, restaurants },
      { returnDocument: "after", runValidators: true },
    ).populate(FOOD_POPULATE);

    if (!food) return notFound(res);

    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) return notFound(res);
    if (food.image) {
      const publicId = food.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await Food.findByIdAndDelete(id);
    res.json({ success: true, message: "Món ăn đã được xóa" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalStats = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$finalPrice" },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$finalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topSellingFoods = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      { $match: { "orderInfo.status": "completed", "orderInfo.createdAt": { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: "$food",
          sold: { $sum: "$quantity" },
          revenue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "foodInfo",
        },
      },
      { $unwind: { path: "$foodInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "foodInfo.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$foodInfo._id",
          name: "$foodInfo.name",
          image: "$foodInfo.image",
          price: "$foodInfo.price",
          category: { $ifNull: ["$category", null] },
          sold: 1,
          revenue: 1,
        },
      },
    ]);

    const categoryStats = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      { $match: { "orderInfo.status": "completed", "orderInfo.createdAt": { $gte: thirtyDaysAgo } } },
      {
        $lookup: {
          from: "foods",
          localField: "food",
          foreignField: "_id",
          as: "foodInfo",
        },
      },
      { $unwind: "$foodInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "foodInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$categoryInfo.name", "Khác"] },
          totalSold: { $sum: "$quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        topSellingFoods,
        dailyOrders,
        categoryStats,
        totalStats: totalStats[0] || { totalOrders: 0, totalRevenue: 0 },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
