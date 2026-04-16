import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import useAuthStore from "@/store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use individual selectors for better performance
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
    setServerError("");
  }, [clearError]);

  // Redirect if already authenticated and user is loaded
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const getRedirectPath = () => {
        if (user?.role === "admin") {
          return location.state?.from?.pathname || "/admin/dashboard";
        } else if (user?.role) {
          return location.state?.from?.pathname || "/dashboard";
        } else {
          return "/";
        }
      };
      navigate(getRedirectPath(), { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const onSubmit = async (data) => {
    setServerError("");

    const result = await login(data.email, data.password);

    if (!result.success) {
      setServerError(result.error);
    }
  };

  return (
    <AuthLayout
      title="خوش آمدید دوباره"
      subtitle="برای ادامه، به حساب کاربری خود وارد شوید"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Server Error Display */}
        {(serverError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
          >
            {serverError || error}
          </motion.div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل آدرس</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pr-10"
              {...register("email", {
                required: "ایمیل الزامی است",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "ایمیل نامعتبر است",
                },
              })}
              disabled={isSubmitting || isLoading}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">پسورد</Label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("password", {
                required: "رمز عبور الزامی است",
                minLength: {
                  value: 8,
                  message: "رمز عبور باید حداقل 8 کاراکتر باشد",
                },
              })}
              disabled={isSubmitting || isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ورود...
            </>
          ) : (
            "وارد شوید"
          )}
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            ثبت نام کنید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
