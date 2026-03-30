import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Thêm người dùng mới
export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Email da ton tai" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Them thanh cong nguoi dung moi",
      user: newUser,
    });
  } catch (error) {
    console.error("Them nguoi dung loi:", error);
    res.status(500).json({ message: error.message });
  }
};

// lay thong tin dang nhap
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoac mat khau khong dung" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoac mat khau khong dung" });
    }

    // tao token jwt
    const token = jwt.sign(
      { id: user._id, role: user.role, restaurant: user.restaurant }, // payload luu thong tin user trong token
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // thoi han ton tai 7 ngay
    );

    const { password: _, ...userInfo } = user.toObject(); // loai password khoi thong tin tra ve

    res.status(200).json({ token, user: userInfo });
  } catch (error) {
    console.error("Dang nhap loi:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Khong tim thay user" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
