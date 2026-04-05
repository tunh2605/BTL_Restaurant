import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import AdminNotification from "../models/AdminNotification.js";

// ─── USER: Tạo đơn hàng mới ──────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, note, paymentMethod } = req.body;
    // items: [{ foodId, name, price, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống." });
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId || null,
      totalPrice,
      note: note || "",
      paymentMethod: paymentMethod || "online",
      status: "pending",
      isPaid: false,
    });

    // Tạo các OrderItem
    const orderItems = items.map((item) => ({
      order: order._id,
      food: item.foodId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    await OrderItem.insertMany(orderItems);

    // Tạo notification cho admin
    await AdminNotification.create({
      type: "new_order",
      title: "Đơn hàng mới",
      message: `Khách hàng vừa đặt đơn hàng #${order._id} trị giá ${totalPrice.toLocaleString("vi-VN")}đ`,
      restaurant: restaurantId || null,
      refType: "Order",
      refId: order._id,
    });

    res.status(201).json({ message: "Tạo đơn hàng thành công.", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── USER: Lấy đơn hàng của mình ─────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name address")
      .sort({ createdAt: -1 });

    // Lấy items cho từng order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order: order._id });
        return { ...order.toObject(), items };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Lấy tất cả đơn hàng ──────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order: order._id });
        return { ...order.toObject(), items };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Cập nhật trạng thái đơn hàng ─────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    res.json({ message: "Cập nhật thành công.", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
