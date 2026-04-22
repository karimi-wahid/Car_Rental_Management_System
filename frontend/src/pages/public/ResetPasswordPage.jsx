import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";
import { calculatePasswordStrength } from "@/utils/passwordStrength.js";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // Auth store
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const password = watch("password", "");

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if authenticated (after successful reset)
  useEffect(() => {
    if (isAuthenticated && isSuccess) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isSuccess, navigate]);

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
    if (!token) {
      setTokenError("لینک بازنشانی نامعتبر است");
      return;
    }

    setTokenError(null);
    const result = await resetPassword(
      token,
      data.password,
      data.passwordConfirm,
    );

    if (result.success) {
      setIsSuccess(true);
      // User is automatically logged in by the backend
      // The auth store will update isAuthenticated
    }
    if (result.tokenExpired) setTokenError(true);
  };

  // Check if error is token-related

  // Show success state (though user will likely be redirected quickly)
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">
              رمز عبور با موفقیت بازنشانی شد!
            </h1>
            <p className="text-muted-foreground mb-6">
              رمز عبور شما با موفقیت تغییر یافت. در حال انتقال به داشبورد...
            </p>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show token error state
  if (tokenError || (error && tokenError && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">
              لینک نامعتبر یا منقضی شده
            </h1>
            <p className="text-muted-foreground mb-6">
              این لینک بازنشانی رمز عبور نامعتبر است یا منقضی شده است. لطفاً یک
              لینک جدید درخواست کنید.
            </p>
            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button className="w-full">درخواست لینک جدید</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  برگشت به صفحه ورود
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            برگشت به صفحه ورود
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">
              تعیین رمز عبور جدید
            </h1>
            <p className="text-muted-foreground">
              لطفاً رمز عبور جدید خود را وارد کنید.
            </p>
          </div>

          {/* Server Error Alert (non-token errors) */}
          {error && !tokenError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور جدید</Label>
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
                  disabled={isLoading}
                  autoComplete="new-password"
                  autoFocus
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">تایید رمز عبور جدید</Label>
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
                  disabled={isLoading}
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

              {/* Password Strength */}
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
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  رمز عبور باید شامل موارد زیر باشد:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { regex: /.{8,}/, text: "حداقل ۸ کاراکتر" },
                    { regex: /[a-z]/, text: "حروف کوچک" },
                    { regex: /[A-Z]/, text: "حروف بزرگ" },
                    { regex: /[0-9]/, text: "اعداد" },
                    { regex: /[@$!%*?&#]/, text: "کاراکتر خاص" },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <span
                        className={cn(
                          "ml-1",
                          req.regex.test(password)
                            ? "text-green-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {req.regex.test(password) ? "✓" : "○"}
                      </span>
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
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال بازنشانی...
                </>
              ) : (
                "بازنشانی رمز عبور"
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
