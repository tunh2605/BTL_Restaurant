import Category from "../models/Category.js";
import Food from "../models/Food.js";

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Danh mục không tồn tại" });

const validateName = (name, res) => {
  if (!name?.trim())
    return res
      .status(400)
      .json({ success: false, message: "Tên danh mục không được để trống" });
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const foodCounts = await Promise.all(
      categories.map((cat) => Food.countDocuments({ category: cat._id })),
    );

    const data = categories.map((cat, i) => ({
      ...cat,
      foodCount: foodCounts[i],
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (validateName(name, res)) return;

    const exists = await Category.exists({ name });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Danh mục đã tồn tại" });

    const category = await Category.create({ name, slug: slugify(name) });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (validateName(name, res)) return;

    const exists = await Category.exists({ name, _id: { $ne: id } });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Danh mục đã tồn tại" });

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true, runValidators: true },
    );

    if (!category) return notFound(res);

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) return notFound(res);

    Food.deleteMany({ category: id }).catch(console.error);

    res.json({ success: true, message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
