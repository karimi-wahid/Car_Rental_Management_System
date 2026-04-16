import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/Loader/PageLoader";
import PublicLayout from "./components/Layouts/PublicLayout";
import { Toaster } from "react-hot-toast";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
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

// Admin pages
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);

const App = () => {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
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
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
