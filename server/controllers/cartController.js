// controllers/cartController.js
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Food from "../models/Food.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; //  lấy id user token

    const cart = await Cart.findOne({ user: userId }).populate(
      "restaurant",
      "name address",
    );

    if (!cart) return res.json({ success: true, data: null });

    const items = await CartItem.find({ cart: cart._id }).populate(
      "food",
      "name image price isAvailable",
    );

    res.json({ success: true, data: { ...cart.toObject(), items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, restaurantId, quantity = 1 } = req.body;

    // lấy thông tin món ăn
    const food = await Food.findById(foodId);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Món ăn không tồn tại" });
    if (!food.isAvailable)
      return res.status(400).json({ success: false, message: "Món ăn đã hết" });

    // tìm cart của user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // chưa có thì tạo mới
      cart = await Cart.create({ user: userId, restaurant: restaurantId });
    } else if (cart.restaurant.toString() !== restaurantId) {
      // nếu khác nhà hàng thì báo lỗi (chưa xóa giỏ cũ)
      return res.status(400).json({
        success: false,
        message:
          "Giỏ hàng đang có món từ nhà hàng khác. Bạn có muốn xóa và đặt lại không?",
        code: "DIFFERENT_RESTAURANT",
      });
    }

    // kiểm tra món đã có trong giỏ chưa
    const existingItem = await CartItem.findOne({
      cart: cart._id,
      food: foodId,
    });

    if (existingItem) {
      //  nếu đã có tăng thêm số lượng
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      // nếu chưa có thì thêm mới
      await CartItem.create({
        cart: cart._id,
        food: foodId,
        name: food.name, // snapshot
        price: food.price, // snapshot
        quantity,
      });
    }

    res.json({ success: true, message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // verify item thuộc về cart của user này
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return notFound(res);

    const item = await CartItem.findOneAndUpdate(
      { _id: itemId, cart: cart._id },
      { quantity },
      { returnDocument: "after" },
    );

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Món không tồn tại trong giỏ" });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return notFound(res);

    await CartItem.findOneAndDelete({ _id: itemId, cart: cart._id });

    // nếu giỏ trống thì xóa luôn cart
    const remaining = await CartItem.countDocuments({ cart: cart._id });
    if (remaining === 0) await Cart.findByIdAndDelete(cart._id);

    res.json({ success: true, message: "Đã xóa khỏi giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return notFound(res);

    await CartItem.deleteMany({ cart: cart._id });
    await Cart.findByIdAndDelete(cart._id);

    res.json({ success: true, message: "Đã xóa giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
