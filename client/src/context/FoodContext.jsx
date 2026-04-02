import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FoodContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  const fetchFoods = useCallback(async (categoryId = "") => {
    try {
      const url = categoryId
        ? `${API}/api/foods/all-foods?category=${categoryId}`
        : `${API}/api/foods/all-foods`;

      const { data } = await axios.get(url);

      setFoods(Array.isArray(data) ? data : (data.data ?? []));
    } catch (error) {
      toast.error("Không thể tải danh sách món ăn");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/api/categories/all-categories`);

      setCategories(Array.isArray(data) ? data : (data.data ?? []));
    } catch (error) {
      toast.error("Không thể tải danh mục");
    }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/restaurants/all-restaurants`,
      );
      setRestaurants(Array.isArray(data) ? data : (data.data ?? []));
    } catch (error) {
      toast.error("Không thể tải nhà hàng");
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchFoods(), fetchCategories(), fetchRestaurants()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchFoods, fetchCategories, fetchRestaurants]);

  return (
    <FoodContext.Provider
      value={{
        foods,
        categories,
        restaurants,
        loading,
        fetchFoods,
        fetchRestaurants,
        refreshFoods: fetchFoods,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);
