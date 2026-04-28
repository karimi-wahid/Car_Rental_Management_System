import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/Loader/PageLoader";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./components/Layouts/PublicLayout";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";

// Public
import ProtectedRoute from "./components/common/ProtectedRoute";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const CarsPage = lazy(() => import("@/pages/public/CarsPage"));
const CarDetailsPage = lazy(() => import("@/pages/public/CarDetailsPage"));

// Auth Pages
const LoginPage = lazy(() => import("@/pages/public/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/public/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/public/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/pages/public/ResetPasswordPage"),
);

// User pages
const UserDashboardPage = lazy(() => import("@/pages/user/UserDashboardPage"));
const MyBookingsPage = lazy(() => import("@/pages/user/MyBookingPage"));
const BookingHistoryPage = lazy(
  () => import("@/pages/user/BookingHistoryPage"),
);
const BookingDetailsPage = lazy(
  () => import("@/pages/user/BookingDetailsPage"),
);
const ProfilePage = lazy(() => import("@/pages/user/ProfilePage"));
const FavoritesPage = lazy(() => import("@/pages/user/FavoritesPage"));

// Admin pages
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);
const ManageCarsPage = lazy(() => import("@/pages/admin/ManageCarsPage"));
const ManageUsersPage = lazy(() => import("@/pages/admin/ManageUsersPage"));
const ManageBookingsPage = lazy(
  () => import("@/pages/admin/ManageBookingsPage"),
);

const App = () => {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route
                path="/bookings/history"
                element={<BookingHistoryPage />}
              />
              <Route path="/bookings/:carId" element={<BookingDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/cars" element={<ManageCarsPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/bookings" element={<ManageBookingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
