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
  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    staffCount: 0,
  });

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

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/restaurants/stats`,
      );
      setStatsData(data);
    } catch (err) {
      console.log("Lỗi khi catch stats" + err);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchFoods(),
        fetchCategories(),
        fetchRestaurants(),
        fetchStats(),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchFoods, fetchCategories, fetchRestaurants, fetchStats]);

  return (
    <FoodContext.Provider
      value={{
        foods,
        statsData,
        categories,
        restaurants,
        loading,
        fetchFoods,
        fetchStats,
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
