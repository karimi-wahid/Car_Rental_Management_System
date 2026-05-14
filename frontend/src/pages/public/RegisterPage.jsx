import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AuthLayout } from "@/components/auth/AuthLayout";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { calculatePasswordStrength } from "@/utils/passwordStrength";

import toast from "react-hot-toast";

// Zod Schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "اسم کامل الزامی است")
      .min(2, "اسم باید حداقل ۲ حرف باشد")
      .max(50, "اسم نمی‌تواند بیشتر از ۵۰ حرف باشد"),

    email: z.string().min(1, "ایمیل الزامی است").email("ایمیل نامعتبر است"),

    password: z
      .string()
      .min(1, "رمز عبور الزامی است")
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .refine((value) => calculatePasswordStrength(value) >= 50, {
        message: "رمز عبور ضعیف است. لطفاً رمز قوی‌تری انتخاب کنید",
      }),

    passwordConfirm: z.string().min(1, "تایید رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["passwordConfirm"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();

  // Auth Store
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serverError, setServerError] = useState("");

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const password = watch("password", "");

  // Clear Errors
  useEffect(() => {
    clearError();
    setServerError("");
  }, [clearError]);

  // Redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Password Strength
  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = (strength) => {
    if (strength < 50) return "bg-destructive";
    if (strength < 75) return "bg-yellow-500";

    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength < 50) return "ضعیف";
    if (strength < 75) return "متوسط";

    return "قوی";
  };

  // Submit
  const onSubmit = async (data) => {
    setServerError("");

    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (result.success) {
      localStorage.setItem("email", data.email);

      toast.success("ایمیل خود را بررسی کنید و کد تایید را وارد کنید");

      navigate("/verify-email");
    } else {
      setServerError(result.error);
    }
  };

  // Password Requirements
  const passwordRequirements = [
    { regex: /.{8,}/, text: "حداقل ۸ کاراکتر" },

    {
      regex: /[a-z]/,
      text: "یک حرف کوچک",
    },

    {
      regex: /[A-Z]/,
      text: "یک حرف بزرگ",
    },

    {
      regex: /[0-9]/,
      text: "یک عدد",
    },

    {
      regex: /[@$!%*?&]/,
      text: "یک کاراکتر خاص",
    },
  ];

  return (
    <AuthLayout
      title="ایجاد حساب کاربری"
      subtitle="ثبت نام کنید تا تجربه‌ی کرایه‌ی موتر لوکس خود را آغاز نمایید"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Server Error */}
        {(serverError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive"
          >
            {serverError || error}
          </motion.div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">اسم کامل</Label>

          <div className="relative">
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              type="text"
              placeholder="محمد علی"
              className="pr-10"
              autoComplete="name"
              disabled={isSubmitting || isLoading}
              {...register("name")}
            />
          </div>

          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

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
          <Label htmlFor="password">رمز عبور</Label>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              autoComplete="new-password"
              disabled={isSubmitting || isLoading}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">تایید رمز عبور</Label>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="passwordConfirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              autoComplete="new-password"
              disabled={isSubmitting || isLoading}
              {...register("passwordConfirm")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.passwordConfirm && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
            >
              {errors.passwordConfirm.message}
            </motion.p>
          )}

          {/* Password Strength */}
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">قدرت رمز عبور</span>

                <span
                  className={cn(
                    "font-medium",
                    passwordStrength < 50 && "text-destructive",
                    passwordStrength >= 50 &&
                      passwordStrength < 75 &&
                      "text-yellow-500",
                    passwordStrength >= 75 && "text-green-500",
                  )}
                >
                  {getStrengthText(passwordStrength)}
                </span>
              </div>

              <Progress
                value={passwordStrength}
                className={cn("h-2", getStrengthColor(passwordStrength))}
              />
            </motion.div>
          )}

          {/* Requirements */}
          <div className="mt-2 space-y-2">
            <p className="mb-2 text-sm text-muted-foreground">
              رمز عبور باید شامل موارد زیر باشد:
            </p>

            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                {req.regex.test(password) ? (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="ml-2 h-4 w-4 text-muted-foreground" />
                )}

                <span
                  className={cn(
                    req.regex.test(password)
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="text-center text-sm text-muted-foreground">
          با ثبت نام، با{" "}
          <Link to="/terms" className="text-primary hover:underline">
            شرایط و قوانین
          </Link>{" "}
          و{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            حریم خصوصی
          </Link>{" "}
          ما موافقت می‌کنید.
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ایجاد حساب کاربری...
            </>
          ) : (
            "ساخت حساب کاربری"
          )}
        </Button>

        {/* Login */}
        <p className="text-center text-sm text-muted-foreground">
          از قبل حساب کاربری دارید؟{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
