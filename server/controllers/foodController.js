import Food from "../models/Food.js";

export const addFood = async (req, res) => {
  try {
    const { name, image, description, price, category } = req.body;
    const food = new Food({ name, image, description, price, category });
    await food.save();
    res.status(201).json(food);
    console.log("Thêm món ăn thành công:", food);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error("Lỗi khi thêm món ăn:", error);
  }
};

export const getFoods = async (req, res) => {
  try {
    console.log("Get foods");
    const { category } = req.query;
    const filter = category ? { category } : {};

    const foods = await Food.find(filter)
      .populate("category")
      .populate("restaurant");
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category")
      .populate("restaurant");
    if (!food) {
      return res.status(404).json({ message: "Món ăn không tồn tại" });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { name, image, description, price, category } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, image, description, price, category },
      { new: true },
    );
    if (!food) {
      return res.status(404).json({ message: "Món ăn không tồn tại" });
    }
    console.log("Cập nhật món ăn thành công:", food);
    res.json(food);
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Món ăn không tồn tại" });
    }
    console.log("Xóa món ăn thành công:", food);
    res.json({ message: "Món ăn đã được xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    res.status(500).json({ message: error.message });
  }
};
