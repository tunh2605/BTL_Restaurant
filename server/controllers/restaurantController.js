import Restaurant from "../models/Restaurant.js";
import cloudinary from "../configs/cloudinary.js";
import User from "../models/User.js";
import Food from "../models/Food.js";

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    let { name, address, images, phone, openTime, closeTime, isOpen } =
      req.body;

    if (!name || !address || !phone || !openTime || !closeTime) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    name = name.trim();
    address = address.trim();
    phone = phone.trim();

    const restaurant = await Restaurant.create({
      name,
      address,
      images: (images || []).map((url) => ({
        url,
        public_id: url.split("/").pop().split(".")[0],
      })),
      phone,
      isOpen: isOpen ?? true,
      openTime,
      closeTime,
    });

    return res.status(201).json({
      success: true,
      message: "Thêm nhà hàng thành công",
      data: restaurant,
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await Food.updateMany({ restaurants: id }, { $pull: { restaurants: id } });

    if (restaurant.images?.length > 0) {
      await Promise.all(
        restaurant.images.map(async (img) => {
          try {
            if (img.public_id) {
              await cloudinary.uploader.destroy(img.public_id);
            }
          } catch (err) {
            console.warn("Cloudinary delete failed:", img.public_id);
          }
        }),
      );
    }

    await Restaurant.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRestaurantStats = async (req, res) => {
  try {
    const [total, active, staffCount] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ isOpen: true }),
      User.countDocuments({ role: "admin" }),
    ]);

    res.json({ total, active, staffCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
