import Food from "../models/Food.js";

const FOOD_POPULATE = [{ path: "category" }, { path: "restaurants" }];

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Món ăn không tồn tại" });

export const addFood = async (req, res) => {
  try {
    const { name, image, description, price, category, restaurants } = req.body;
    // restaurants nhận vào array id: ["id1", "id2", ...]
    const food = await Food.create({
      name,
      image,
      description,
      price,
      category,
      restaurants,
    });

    res.status(201).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFoods = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    if (req.query.restaurant) filter.restaurants = req.query.restaurant;

    const foods = await Food.find(filter).populate(FOOD_POPULATE);

    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(FOOD_POPULATE);

    if (!food) return notFound(res);

    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { name, image, description, price, category, restaurants } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, image, description, price, category, restaurants },
      { new: true, runValidators: true },
    ).populate(FOOD_POPULATE);

    if (!food) return notFound(res);

    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) return notFound(res);

    res.json({ success: true, message: "Món ăn đã được xóa" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
