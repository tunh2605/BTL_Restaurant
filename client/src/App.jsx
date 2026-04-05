import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./pages/layouts/MainLayout";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Menu = lazy(() => import("./pages/Menu"));
const FoodDetail = lazy(() => import("./pages/FoodDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Contact = lazy(() => import("./pages/Contact"));
const Reserve = lazy(() => import("./pages/Reserve"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentReturn = lazy(() => import("./pages/PaymentReturn"));
const TestPayment = lazy(() => import("./pages/TestPayment"));

const Layout = lazy(() => import("./pages/layouts/Layout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ListFood = lazy(() => import("./pages/admin/ListFood"));
const ListOrder = lazy(() => import("./pages/admin/ListOrder"));
const ListUser = lazy(() => import("./pages/admin/ListUser"));
const ListReservation = lazy(() => import("./pages/admin/ListReservation"));
const ListPromotion = lazy(() => import("./pages/admin/ListPromotion"));
const Report = lazy(() => import("./pages/admin/Report"));
const ListRestaurant = lazy(() => import("./pages/admin/ListRestaurant"));
const AddFood = lazy(() => import("./pages/admin/AddFood"));
const EditFood = lazy(() => import("./pages/admin/EditFood"));

function App() {
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, isAdmin, loading } = useAuth();

    if (loading) return <div className="min-h-screen" />;
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (adminOnly && !isAdmin) return <Navigate to="/" />;

    return children;
  };

  return (
    <>
      <Toaster />
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:category" element={<Menu />} />
            <Route path="/menu/:category/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/payment/return" element={<PaymentReturn />} />
          <Route path="/test" element={<TestPayment />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly>
                <Layout></Layout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="foods" element={<ListFood />} />
            <Route path="foods/add" element={<AddFood />} />
            <Route path="foods/edit/:id" element={<EditFood />} />
            <Route path="orders" element={<ListOrder />} />
            <Route path="users" element={<ListUser />} />
            <Route path="reservations" element={<ListReservation />} />
            <Route path="promotions" element={<ListPromotion />} />
            <Route path="report" element={<Report />} />
            <Route path="restaurant" element={<ListRestaurant />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
