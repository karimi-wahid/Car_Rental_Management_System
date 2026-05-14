import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";

import { useAuthStore } from "@/store/authStore";

// Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, "ایمیل الزامی است").email("ایمیل نامعتبر است"),

  password: z.string().min(1, "رمز عبور الزامی است"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand Store
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Clear Errors
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect After Login
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const getRedirectPath = () => {
        if (user.role === "admin") {
          return location.state?.from?.pathname || "/admin/dashboard";
        }

        return location.state?.from?.pathname || "/dashboard";
      };

      navigate(getRedirectPath(), { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Submit Handler
  const onSubmit = async (data) => {
    clearError();
    await login(data.email, data.password);
  };

  return (
    <AuthLayout
      title="خوش آمدید دوباره"
      subtitle="برای ادامه، به حساب کاربری خود وارد شوید"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Server Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل آدرس</Label>

          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pr-10"
              autoComplete="email"
              disabled={isSubmitting || isLoading}
              {...register("email")}
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

        {/* Password */}
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
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              autoComplete="current-password"
              disabled={isSubmitting || isLoading}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
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

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
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

        {/* Register */}
        <p className="text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            ثبت نام کنید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
