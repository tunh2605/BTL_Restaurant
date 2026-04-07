import { VNPay, ProductCode, VnpLocale, dateFormat, ignoreLogger } from "vnpay";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import AdminNotification from "../models/AdminNotification.js";
import Promotion from "../models/Promotion.js";
import PromotionFood from "../models/PromotionFood.js";

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_HASH_SECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
  loggerFn: ignoreLogger,
});

const getVNPayDate = () => dateFormat(new Date());

const getVNPayExpireDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + 1); // hết hạn sau 1 ngày
  return dateFormat(now);
};

// ─── Tạo URL thanh toán VNPay (CHƯA tạo order) ───────────────────────────────
export const createVNPayUrl = async (req, res) => {
  try {
    const { restaurantId, items, note, promotionId } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống." });

    // Tính tổng tiền gốc
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Validate promotion và tính discount (giống createOrder)
    let discount = 0;
    let promotionData = null;

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
        return res.status(400).json({ message: `Đơn tối thiểu ${promo.minOrderValue}đ` });

      if (promo.type === "order") {
        if (promo.discountType === "percent") {
          discount = (totalPrice * promo.discountValue) / 100;
          if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
        } else {
          discount = Math.min(promo.discountValue, totalPrice);
        }
      }

      if (promo.type === "food") {
        const promotionFoods = await PromotionFood.find({ promotion: promo._id });
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
            if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
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
    }

    const finalPrice = totalPrice - discount;

    // Tạo txnRef duy nhất
    const txnRef = `${Date.now()}${req.user.id.toString().slice(-6)}`;

    // Lưu Payment pending — chưa có order, lưu snapshot giỏ hàng để dùng sau
    const payment = await Payment.create({
      order: null,
      user: req.user.id,
      restaurant: restaurantId || null,
      amount: finalPrice,
      method: "vnpay",
      status: "pending",
      txnRef,
      cartSnapshot: {
        restaurantId,
        items,
        note: note || "",
        promotionId: promotionId || null,
        totalPrice,
        discount,
        finalPrice,
        promotionData,
      },
    });

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: finalPrice,
      vnp_IpAddr: clientIp,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || `${process.env.FE_BASE_URL}/payment/return`,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_Locale: VnpLocale.VN,
      vnp_OrderType: ProductCode.Other,
      vnp_CreateDate: getVNPayDate(),
      vnp_ExpireDate: getVNPayExpireDate(),
    });

    res.json({ paymentUrl, paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo URL thanh toán.", error: err.message });
  }
};

// ─── Xử lý return từ VNPay (FE gọi để verify) ────────────────────────────────
export const verifyReturn = async (req, res) => {
  try {
    const vnpParams = req.query;

    const verify = vnpay.verifyReturnUrl(vnpParams);
    const txnRef = vnpParams["vnp_TxnRef"];
    const transactionId = vnpParams["vnp_TransactionNo"];

    const payment = await Payment.findOne({ txnRef });
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch." });
    }

    if (verify.isSuccess) {
      // Guard: nếu đã xử lý rồi (IPN về trước) thì không tạo order lần nữa
      const alreadySuccess = payment.status === "success";

      // Cập nhật Payment
      payment.status = "success";
      payment.transactionId = transactionId;
      payment.gatewayResponse = vnpParams;
      payment.paidAt = new Date();

      // Tạo order từ cartSnapshot nếu chưa có
      if (!alreadySuccess && !payment.order) {
        const snap = payment.cartSnapshot;

        // Tạo order với status completed + isPaid true
        const order = await Order.create({
          user: payment.user,
          restaurant: snap.restaurantId || null,
          totalPrice: snap.totalPrice,
          discount: snap.discount,
          finalPrice: snap.finalPrice,
          promotion: snap.promotionData || null,
          note: snap.note || "",
          paymentMethod: "vnpay",
          status: "completed",
          isPaid: true,
        });

        // Tạo order items
        const orderItems = snap.items.map((item) => ({
          order: order._id,
          food: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));
        await OrderItem.insertMany(orderItems);

        // Tăng usedCount khuyến mãi
        if (snap.promotionId) {
          await Promotion.findByIdAndUpdate(snap.promotionId, {
            $inc: { usedCount: 1 },
          });
        }

        // Liên kết payment với order vừa tạo
        payment.order = order._id;

        await AdminNotification.create({
          type: "new_order",
          title: "Đơn hàng mới (VNPay)",
          message: `Đơn #${order._id} - ${snap.finalPrice.toLocaleString("vi-VN")}đ đã thanh toán thành công`,
          restaurant: snap.restaurantId || null,
          refType: "Order",
          refId: order._id,
        });
      }

      await payment.save();

      // Tạo notification payment_success nếu chưa có
      if (!alreadySuccess) {
        await AdminNotification.create({
          type: "payment_success",
          title: "Thanh toán thành công",
          message: `Đơn hàng #${payment.order} đã được thanh toán qua VNPay. Mã GD: ${transactionId}`,
          restaurant: payment.restaurant,
          refType: "Payment",
          refId: payment._id,
        });
      }

      return res.json({ success: true, message: "Thanh toán thành công.", payment });
    } else {
      // Thanh toán thất bại — không tạo order
      payment.status = "failed";
      payment.gatewayResponse = vnpParams;
      await payment.save();

      await AdminNotification.create({
        type: "payment_failed",
        title: "Thanh toán thất bại",
        message: `Giao dịch ${txnRef} thất bại. Mã lỗi: ${vnpParams["vnp_ResponseCode"]}`,
        restaurant: payment.restaurant,
        refType: "Payment",
        refId: payment._id,
      });

      return res.json({ success: false, message: "Thanh toán thất bại.", payment });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi xác thực thanh toán.", error: err.message });
  }
};

// ─── IPN: VNPay gọi server-to-server ─────────────────────────────────────────
export const vnpayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;
    const verify = vnpay.verifyReturnUrl(vnpParams);
    const txnRef = vnpParams["vnp_TxnRef"];
    const transactionId = vnpParams["vnp_TransactionNo"];

    const payment = await Payment.findOne({ txnRef });
    if (!payment) return res.json({ RspCode: "01", Message: "Order not found" });

    if (payment.status === "success") {
      return res.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (verify.isSuccess) {
      payment.status = "success";
      payment.transactionId = transactionId;
      payment.gatewayResponse = vnpParams;
      payment.paidAt = new Date();

      // Tạo order từ cartSnapshot nếu chưa có
      if (!payment.order) {
        const snap = payment.cartSnapshot;

        const order = await Order.create({
          user: payment.user,
          restaurant: snap.restaurantId || null,
          totalPrice: snap.totalPrice,
          discount: snap.discount,
          finalPrice: snap.finalPrice,
          promotion: snap.promotionData || null,
          note: snap.note || "",
          paymentMethod: "vnpay",
          status: "completed",
          isPaid: true,
        });

        const orderItems = snap.items.map((item) => ({
          order: order._id,
          food: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));
        await OrderItem.insertMany(orderItems);

        if (snap.promotionId) {
          await Promotion.findByIdAndUpdate(snap.promotionId, {
            $inc: { usedCount: 1 },
          });
        }

        payment.order = order._id;

        await AdminNotification.create({
          type: "new_order",
          title: "Đơn hàng mới (VNPay)",
          message: `Đơn #${order._id} - ${snap.finalPrice.toLocaleString("vi-VN")}đ đã thanh toán thành công`,
          restaurant: snap.restaurantId || null,
          refType: "Order",
          refId: order._id,
        });
      }

      await payment.save();
    } else {
      payment.status = "failed";
      payment.gatewayResponse = vnpParams;
      await payment.save();
    }

    return res.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (err) {
    return res.json({ RspCode: "99", Message: err.message });
  }
};

// ─── TEST: Tạo URL không cần auth, amount hardcode ───────────────────────────
export const testCreateUrl = async (req, res) => {
  try {
    const txnRef = `TEST${Date.now()}`;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: 10000,
      vnp_IpAddr: "127.0.0.1",
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || `${process.env.FE_BASE_URL}/payment/return`,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_Locale: VnpLocale.VN,
      vnp_OrderType: ProductCode.Other,
      vnp_CreateDate: getVNPayDate(),
      vnp_ExpireDate: getVNPayExpireDate(),
    });

    // Lưu Payment dummy để verify-return hoạt động
    await Payment.create({
      order: "000000000000000000000001",
      user: "000000000000000000000001",
      amount: 10000,
      method: "vnpay",
      status: "pending",
      txnRef,
    });

    res.json({ paymentUrl, txnRef });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN: Lấy lịch sử thanh toán ──────────────────────────────────────────
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server.", error: err.message });
  }
};
