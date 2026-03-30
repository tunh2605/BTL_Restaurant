import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white w-[90%] max-w-sm rounded-3xl p-6 shadow-xl animate-slideUp"
          >
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {title || "Xác nhận"}
              </h3>
              <p className="text-sm text-gray-500">
                {description ||
                  "Bạn có chắc chắn muốn thực hiện hành động này?"}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-[#7C2E08] text-white hover:bg-[#8e370b] transition cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
