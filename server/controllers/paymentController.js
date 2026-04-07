import { VNPay, ProductCode, VnpLocale, dateFormat, ignoreLogger } from "vnpay";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AdminNotification from "../models/AdminNotification.js";

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

// ─── Tạo URL thanh toán VNPay ─────────────────────────────────────────────────
export const createVNPayUrl = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    // Tạo txnRef duy nhất — VNPay chỉ chấp nhận [a-zA-Z0-9], không có dấu gạch ngang
    const txnRef = `${Date.now()}${orderId.toString().slice(-6)}`;

    // Tạo bản ghi Payment trạng thái pending
    // Dùng finalPrice (sau giảm giá) nếu có, fallback về totalPrice
    const chargeAmount = order.finalPrice ?? order.totalPrice;

    const payment = await Payment.create({
      order: orderId,
      user: req.user.id,
      restaurant: order.restaurant,
      amount: chargeAmount,
      method: "vnpay",
      status: "pending",
      txnRef,
    });

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: chargeAmount,
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
      // Guard: nếu đã xử lý rồi (IPN về trước) thì không tạo noti lần nữa
      const alreadySuccess = payment.status === "success";

      // Cập nhật Payment
      payment.status = "success";
      payment.transactionId = transactionId;
      payment.gatewayResponse = vnpParams;
      payment.paidAt = new Date();
      await payment.save();

      // Cập nhật Order → completed
      await Order.findByIdAndUpdate(payment.order, { isPaid: true, status: "completed" });

      // Tạo notification chỉ khi chưa có (tránh duplicate nếu FE gọi 2 lần)
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
      // Thanh toán thất bại
      payment.status = "failed";
      payment.gatewayResponse = vnpParams;
      await payment.save();

      await AdminNotification.create({
        type: "payment_failed",
        title: "Thanh toán thất bại",
        message: `Đơn hàng #${payment.order} thanh toán thất bại. Mã lỗi: ${vnpParams["vnp_ResponseCode"]}`,
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
      await payment.save();

      await Order.findByIdAndUpdate(payment.order, { isPaid: true, status: "completed" });
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
