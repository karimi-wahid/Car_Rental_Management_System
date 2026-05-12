import { useState } from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  Send,
  Star,
  User,
  Mail,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...formData,
      rating,
    });

    // ارسال به API
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-4xl font-bold">ارسال نظریه</h1>

          <p className="mt-3 text-muted-foreground text-lg">
            نظریات، پیشنهادات و انتقادات شما برای ما مهم است
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl rounded-[32px] overflow-hidden bg-background/80 backdrop-blur">
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>نام کامل</Label>

                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                      <Input
                        placeholder="نام خود را وارد کنید"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        className="h-12 pr-12 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ایمیل</Label>

                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        className="h-12 pr-12 rounded-2xl text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label>امتیاز شما</Label>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label>نظریه شما</Label>

                  <Textarea
                    rows={6}
                    placeholder="نظریه، پیشنهاد یا انتقاد خود را بنویسید..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="rounded-3xl resize-none p-4"
                  />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />

                    <h4 className="font-semibold">پاسخ سریع</h4>

                    <p className="text-sm text-muted-foreground mt-1">
                      نظریات شما بررسی می‌شود
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <CheckCircle2 className="h-6 w-6 text-blue-500 mb-2" />

                    <h4 className="font-semibold">بهبود سیستم</h4>

                    <p className="text-sm text-muted-foreground mt-1">
                      نظریات شما باعث پیشرفت ما می‌شود
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <CheckCircle2 className="h-6 w-6 text-purple-500 mb-2" />

                    <h4 className="font-semibold">امنیت اطلاعات</h4>

                    <p className="text-sm text-muted-foreground mt-1">
                      اطلاعات شما محفوظ خواهد بود
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-base font-semibold"
                >
                  <Send className="ml-2 h-5 w-5" />
                  ارسال نظریه
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
