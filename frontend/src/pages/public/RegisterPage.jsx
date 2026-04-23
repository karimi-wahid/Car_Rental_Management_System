import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
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

const RegisterPage = () => {
  const navigate = useNavigate();

  // Auth store
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const password = watch("password", "");
  const passwordConfirm = watch("passwordConfirm", "");

  // Clear error when component mounts
  useEffect(() => {
    clearError();
    setServerError("");
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const onSubmit = async (data) => {
    setServerError("");

    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setServerError(result.error);
    }
  };

  const passwordRequirements = [
    { regex: /.{8,}/, text: "حداقل ۸ کاراکتر" },
    { regex: /[a-z]/, text: "یک حرف کوچک" },
    { regex: /[A-Z]/, text: "یک حرف بزرگ" },
    { regex: /[0-9]/, text: "یک عدد" },
    { regex: /[@$!%*?&]/, text: "یک کاراکتر خاص" },
  ];

  return (
    <AuthLayout
      title="ایجاد حساب کاربری"
      subtitle="ثبت نام کنید تا تجربه‌ی کرایه‌ی موتر لوکس خود را آغاز نمایید"
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

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">اسم کامل</Label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="name"
              type="text"
              placeholder="محمد علی"
              className="pr-10"
              {...register("name", {
                required: "اسم کامل الزامی است",
                minLength: {
                  value: 2,
                  message: "اسم باید حداقل ۲ حرف باشد",
                },
                maxLength: {
                  value: 50,
                  message: "اسم نمی‌تواند بیشتر از ۵۰ حرف باشد",
                },
              })}
              disabled={isSubmitting || isLoading}
              autoComplete="name"
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
          <Label htmlFor="password">رمز عبور</Label>
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
                  message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
                },
                validate: (value) => {
                  const strength = calculatePasswordStrength(value);
                  if (strength < 50) {
                    return "رمز عبور ضعیف است. لطفاً رمز قوی‌تری انتخاب کنید";
                  }
                  return true;
                },
              })}
              disabled={isSubmitting || isLoading}
              autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">تایید رمز عبور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="passwordConfirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("passwordConfirm", {
                required: "تایید رمز عبور الزامی است",
                validate: (value) =>
                  value === password || "رمز عبور و تایید آن مطابقت ندارند",
              })}
              disabled={isSubmitting || isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
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

          {/* Password Strength Meter */}
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 mt-4"
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

          {/* Password Requirements */}
          <div className="space-y-2 mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              رمز عبور باید شامل موارد زیر باشد:
            </p>
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                {req.regex.test(password) ? (
                  <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground ml-2" />
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

        {/* Terms and Conditions */}
        <div className="text-sm text-muted-foreground text-center">
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
              در حال ایجاد حساب کاربری...
            </>
          ) : (
            "ساخت حساب کاربری"
          )}
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          از قبل حساب کاربری دارید؟{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            وارد شوید
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
