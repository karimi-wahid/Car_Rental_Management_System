import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "motion/react";

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

// Zod Schema
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "ایمیل الزامی است").email("ایمیل نامعتبر است"),
});

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  // Auth Store
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const isLoading = useAuthStore((state) => state.isLoading);

  const error = useAuthStore((state) => state.error);

  const clearError = useAuthStore((state) => state.clearError);

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),

    defaultValues: {
      email: "",
    },
  });

  // Clear Errors
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Submit
  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);

    if (result.success) {
      setSubmittedEmail(data.email);

      setIsSuccess(true);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="mb-4 text-2xl font-bold">ایمیل‌تان را چک کنید</h1>

            <p className="mb-6 text-muted-foreground">
              لینک تغییر رمز عبور به ایمیل{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>{" "}
              ارسال شد.
            </p>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ایمیلی دریافت نکردید؟
              </p>

              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="w-full"
              >
                دوباره تلاش کنید
              </Button>

              <Link to="/login">
                <Button variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Back */}
          <Link
            to="/login"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            برگشت به صفحه ورود
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold">
              رمز عبور را فراموش کرده‌اید؟
            </h1>

            <p className="text-muted-foreground">
              ایمیل خود را وارد کنید تا لینک بازنشانی رمز برایتان ارسال شود.
            </p>
          </div>

          {/* Server Error */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
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
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pr-10"
                  autoComplete="email"
                  autoFocus
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Submit */}
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

            {/* Login */}
            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
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
