import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAuthStore from "@/store/authStore";

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Auth store
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);

    if (result.success) {
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    }
  };

  // Success state after email is sent
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
              ایمیل‌تان را چک کنید
            </h1>
            <p className="text-muted-foreground mb-6">
              لینک تغییر رمز عبور به ایمیل{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>{" "}
              ارسال شد. این لینک پس از ۱۰ دقیقه بی‌اعتبار می‌شود.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ایمیلی دریافت نکردید؟ پوشه اسپم را چک کنید یا
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="w-full"
              >
                دوباره تلاش کنید
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="gap-2 w-full">
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
              رمز عبور را فراموش کرده‌اید؟
            </h1>
            <p className="text-muted-foreground">
              نگران نباشید! ایمیل خود را وارد کنید تا لینک بازنشانی رمز برایتان
              بفرستیم.
            </p>
          </div>

          {/* Server Error Alert */}
          {error && (
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                "فرستادن لینک تغییر رمز"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                به خاطر آوردید؟ وارد شوید
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
