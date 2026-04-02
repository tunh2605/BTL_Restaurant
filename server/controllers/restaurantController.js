import Restaurant from "../models/Restaurant.js";
import cloudinary from "cloudinary";

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
    let { name, address, images, phone, openTime, closeTime } = req.body;

    if (!name || !address || !phone) {
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
      images,
      phone,
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
      new: true,
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
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (restaurant.images?.length > 0) {
      await Promise.all(
        restaurant.images.map((img) =>
          cloudinary.v2.uploader.destroy(img.public_id),
        ),
      );
    }

    await Restaurant.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Restaurant deleted successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
