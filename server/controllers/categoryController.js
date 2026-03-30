import Category from "../models/Category.js";
import Food from "../models/Food.js";

const slugify = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => ({
        ...cat.toObject(),
        foodCount: await Food.countDocuments({ category: cat._id }),
      })),
    );
    res.json(categoriesWithCount);
    console.log("Lấy danh mục thành công:", categoriesWithCount);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name);
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên danh mục không được để trống" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }
    const category = new Category({ name, slug });
    await category.save();
    console.log("Thêm danh mục thành công:", category);
    res
      .status(201)
      .json({ message: "Danh mục đã được thêm thành công", category });
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    await Food.deleteMany({ category: id });
    console.log("Xóa danh mục thành công:", category);
    res.json({ message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = slugify(name);
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên danh mục không được để trống" });
    }
    const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true },
    );
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.json({ message: "Danh mục đã được cập nhật thành công", category });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};
