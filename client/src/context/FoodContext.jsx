import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async (categoryId = "") => {
    try {
      const url = categoryId
        ? `${import.meta.env.VITE_API_URL}/api/foods/all-foods?category=${categoryId}`
        : `${import.meta.env.VITE_API_URL}/api/foods/all-foods`;
      const { data } = await axios.get(url);
      setFoods(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/all-categories`,
      );
      console.log("categories:", typeof data, Array.isArray(data), data);
      setCategories(data);
    } catch (error) {
      console.error("status:", error.response?.status);
      console.error("data:", error.response?.data);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchFoods(), fetchCategories()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const refreshFoods = () => fetchFoods();
  const refreshCategories = () => fetchCategories();

  return (
    <FoodContext.Provider
      value={{
        foods,
        categories,
        loading,
        setFoods,
        refreshFoods,
        refreshCategories,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);
