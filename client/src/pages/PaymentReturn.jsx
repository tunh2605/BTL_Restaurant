import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { BlurCircle } from "../components/BlurCircle";
import { useCart } from "../context/CartContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [message, setMessage] = useState("");
  const [txnInfo, setTxnInfo] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await axios.get(`${API}/api/payments/verify-return`, { params });

        if (res.data.success) {
          setStatus("success");
          setMessage("Thanh toán thành công!");
          setTxnInfo({
            amount: res.data.payment?.amount,
            transactionId: res.data.payment?.transactionId,
            txnRef: res.data.payment?.txnRef,
          });
          clearCart();
        } else {
          setStatus("failed");
          setMessage("Thanh toán thất bại. Vui lòng thử lại.");
        }
      } catch {
        setStatus("failed");
        setMessage("Không thể xác minh giao dịch. Vui lòng liên hệ hỗ trợ.");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
      <BlurCircle top="20%" left="10%" size="300px" color="bg-primary/40" />
      <BlurCircle bottom="10%" right="5%" size="250px" color="bg-secondary/60" />

      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">Đang xác nhận thanh toán...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-5">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
            <p className="text-gray-400 text-sm">
              Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ chuẩn bị ngay.
            </p>

            {txnInfo && (
              <div className="bg-[#F5EDE3] rounded-2xl p-5 text-left space-y-3 text-sm">
                {txnInfo.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số tiền</span>
                    <span className="font-semibold text-gray-800">
                      {txnInfo.amount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                {txnInfo.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã giao dịch</span>
                    <span className="font-semibold text-gray-800">{txnInfo.transactionId}</span>
                  </div>
                )}
                {txnInfo.txnRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã tham chiếu</span>
                    <span className="font-mono text-xs text-gray-600 break-all">{txnInfo.txnRef}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                to="/profile"
                className="flex-1 py-3 bg-primary-dull text-white rounded-full font-semibold hover:bg-primary-dull/90 transition text-sm"
              >
                Xem đơn hàng
              </Link>
              <Link
                to="/menu"
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition text-sm"
              >
                Tiếp tục mua
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-5">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
            <p className="text-gray-400 text-sm">
              Giao dịch không thành công. Đơn hàng của bạn chưa được thanh toán.
            </p>

            <div className="flex gap-3 pt-2">
              <Link
                to="/cart"
                className="flex-1 py-3 bg-primary-dull text-white rounded-full font-semibold hover:bg-primary-dull/90 transition text-sm"
              >
                Thử lại
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition text-sm"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
