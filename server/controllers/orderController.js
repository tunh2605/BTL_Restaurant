import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import AdminNotification from "../models/AdminNotification.js";
import Promotion from "../models/Promotion.js";
import PromotionFood from "../models/PromotionFood.js";
import Food from "../models/Food.js";

// ─── USER: Tạo đơn hàng mới ──────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, note, phone, paymentMethod, promotionId } = req.body;

    if (!phone) return res.status(400).json({ message: "Vui lòng nhập số điện thoại." });

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống." });

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // validate cho khuyến mãi
    let discount = 0;
    let promotionData = null;
    let promoToSave = null;

    if (promotionId) {
      const promo = await Promotion.findById(promotionId);

      if (!promo || !promo.isActive)
        return res.status(400).json({ message: "Mã không hợp lệ." });

      const now = new Date();
      if (promo.startDate > now || promo.endDate < now)
        return res.status(400).json({ message: "Mã đã hết hạn." });
      if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
        return res.status(400).json({ message: "Mã đã hết lượt." });
      if (totalPrice < promo.minOrderValue)
        return res
          .status(400)
          .json({ message: `Đơn tối thiểu ${promo.minOrderValue}đ` });

      // xử lí giá cho đơn hàng và món ăn
      if (promo.type === "order") {
        if (promo.discountType === "percent") {
          discount = (totalPrice * promo.discountValue) / 100;
          if (promo.maxDiscount)
            discount = Math.min(discount, promo.maxDiscount);
        } else {
          discount = Math.min(promo.discountValue, totalPrice);
        }
      }

      if (promo.type === "food") {
        const promotionFoods = await PromotionFood.find({
          promotion: promo._id,
        });
        let applicableTotal = 0;
        items.forEach((item) => {
          const matched = promotionFoods.some(
            (pf) => String(pf.food) === String(item.foodId),
          );
          if (matched) applicableTotal += item.price * item.quantity;
        });

        if (applicableTotal > 0) {
          if (promo.discountType === "percent") {
            discount = (applicableTotal * promo.discountValue) / 100;
            if (promo.maxDiscount)
              discount = Math.min(discount, promo.maxDiscount);
          } else {
            discount = Math.min(promo.discountValue, applicableTotal);
          }
        }
      }

      promotionData = {
        promotionId: promo._id,
        name: promo.name,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      };

      promoToSave = promo;
    }

    const finalPrice = totalPrice - discount;

    // logic đơn hàng
    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId || null,
      totalPrice,
      discount,
      finalPrice,
      promotion: promotionData,
      note: note || "",
      phone,
      paymentMethod: paymentMethod || "online",
      status: "pending",
      isPaid: false,
    });

    const orderItems = items.map((item) => ({
      order: order._id,
      food: item.foodId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    await OrderItem.insertMany(orderItems);

    // Cập nhật số lượng bán cho từng món ăn
    for (const item of items) {
      await Food.findByIdAndUpdate(item.foodId, {
        $inc: { sold: item.quantity },
      });
    }

    // Chỉ tăng usedCount của khuyến mãi sau khi tạo đơn hàng thành công
    if (promoToSave) {
      promoToSave.usedCount += 1;
      await promoToSave.save();
    }

    await AdminNotification.create({
      type: "new_order",
      title: "Đơn hàng mới",
      message: `Đơn #${order._id} - ${finalPrice.toLocaleString("vi-VN")}đ`,
      restaurant: restaurantId || null,
      refType: "Order",
      refId: order._id,
    });

    res.status(201).json({ message: "Tạo đơn hàng thành công.", order });
  } catch (err) {
    console.error(err);
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
      }),
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
      }),
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
      { returnDocument: "after" },
    );

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    res.json({ message: "Cập nhật thành công.", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};

// ─── ADMIN: Xóa đơn hàng ─────────────────────────────────────────────────────
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    await OrderItem.deleteMany({ order: id });

    res.json({ message: "Xóa đơn hàng thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
