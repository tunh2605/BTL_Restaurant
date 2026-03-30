import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Khong co token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // giai ma token va gan thong tin user vao request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } — gắn vào request để dùng tiếp
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// kiem tra quyen admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!["admin", "hqadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }
    next();
  });
};

// kiem tra quyen hq admin
export const verifyHQAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "hqadmin") {
      return res
        .status(403)
        .json({ message: "Chỉ HQ Admin mới có quyền thực hiện." });
    }
    next();
  });
};
