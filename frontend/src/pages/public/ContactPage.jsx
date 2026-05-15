import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import useContactStore from "@/store/contactStore";
import { useLocation } from "react-router-dom";

// Zod Schema
const contactSchema = z.object({
  name: z.string().min(1, "نام الزامی است").min(2, "نام خیلی کوتاه است"),

  email: z.string().min(1, "ایمیل الزامی است").email("ایمیل نامعتبر است"),

  phone: z.string().optional(),

  subject: z.string().min(1, "موضوع الزامی است"),

  message: z
    .string()
    .min(1, "پیام الزامی است")
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(2000, "پیام نباید از ۲۰۰۰ کاراکتر بیشتر باشد"),
});

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "آدرس",
    value: "کابل، ناحیه سوم، سرک دارالامان، مقابل پارک",
  },

  {
    icon: Phone,
    label: "تلفن",
    value: "+93 700 123 456",
  },

  {
    icon: Mail,
    label: "ایمیل",
    value: "info@luxcar.af",
  },

  {
    icon: Clock,
    label: "ساعات کاری",
    value: "شنبه تا پنج‌شنبه، ۸ صبح تا ۸ شب",
  },
];

const SUBJECTS = [
  { value: "general", label: "سوال عمومی" },
  { value: "booking", label: "مشکل رزرو" },
  { value: "complaint", label: "شکایت" },
  { value: "partnership", label: "همکاری تجاری" },
  { value: "other", label: "سایر" },
];

const FAQS = [
  {
    q: "چطور می‌توانم موتر رزرو کنم؟",
    a: "از صفحه موترها، موتر مورد نظر را انتخاب کنید، تاریخ شروع و پایان را مشخص کنید و روی دکمه رزرو کلیک کنید.",
  },

  {
    q: "آیا امکان لغو رزرو وجود دارد؟",
    a: "بله، تا ۲۴ ساعت قبل از شروع رزرو می‌توانید آن را لغو کنید.",
  },

  {
    q: "چه مدارکی برای کرایه موتر نیاز است؟",
    a: "گواهینامه معتبر رانندگی و کارت ملی یا پاسپورت الزامی است.",
  },

  {
    q: "آیا تحویل در محل امکان‌پذیر است؟",
    a: "بله، برای رزروهای بالای ۳ روز، تحویل در محل رایگان انجام می‌شود.",
  },
];

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-right transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <span className="text-sm font-medium text-zinc-900 dark:text-white">
          {faq.q}
        </span>

        {open ? (
          <ChevronUp className="ml-3 h-4 w-4 shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown className="ml-3 h-4 w-4 shrink-0 text-zinc-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="border-t border-zinc-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-500 dark:border-zinc-800">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = () => {
  const user = useAuthStore((state) => state.user);

  const { createContact, submitting } = useContactStore();

  const location = useLocation();

  const [success, setSuccess] = useState(false);

  const [trackingId, setTrackingId] = useState("");

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),

    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      subject: location.state?.subject || "general",

      message: location.state?.bookingId
        ? `شماره رزرو: ${location.state.bookingId}\n\n`
        : "",
    },
  });

  const subject = watch("subject");

  // Submit
  const onSubmit = async (data) => {
    const result = await createContact({
      ...data,
      bookingId: location.state?.bookingId || undefined,
    });

    if (result.success) {
      setTrackingId(result.data._id);

      setSuccess(true);

      reset();

      toast.success("پیام شما ارسال شد!");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero */}
      <section className="dark:bg-zinc-950 px-6 py-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <Badge className="mb-4 border-black bg-white dark:border-white/20 dark:bg-white/10 dark:text-white text-black">
            تماس با ما
          </Badge>

          <h1 className="mb-4 text-4xl font-bold dark:text-white text-black">
            چطور می‌توانیم کمک کنیم؟
          </h1>

          <p className="text-zinc-400">
            تیم ما آماده پاسخگویی به سوالات و حل مشکلات شماست.
          </p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="space-y-4">
              {CONTACT_INFO.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: -16,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.07,
                  }}
                  className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
                    <item.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-zinc-400">{item.label}</p>

                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                <MessageSquare className="h-4 w-4" />
                سوالات متداول
              </h3>

              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 px-8 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <CheckCircle className="mx-auto mb-6 h-16 w-16 text-emerald-500" />

                  <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">
                    پیام شما ارسال شد!
                  </h2>

                  <p className="mb-2 text-zinc-500">از تماس شما متشکریم.</p>

                  {trackingId && (
                    <p className="mb-6 font-mono text-xs text-zinc-400">
                      شماره پیگیری: {trackingId.slice(-8).toUpperCase()}
                    </p>
                  )}

                  <Button variant="outline" onClick={() => setSuccess(false)}>
                    ارسال پیام جدید
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
                    ارسال پیام
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">نام کامل *</Label>

                        <Input
                          id="name"
                          placeholder="محمد احمدی"
                          className="bg-white dark:bg-zinc-800"
                          {...register("name")}
                        />

                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">ایمیل *</Label>

                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="bg-white dark:bg-zinc-800"
                          {...register("email")}
                        />

                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">شماره تماس</Label>

                        <Input
                          id="phone"
                          placeholder="+93 700 000 000"
                          className="bg-white dark:bg-zinc-800"
                          {...register("phone")}
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label>موضوع *</Label>

                        <Select
                          value={subject}
                          onValueChange={(val) => setValue("subject", val)}
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-800">
                            <SelectValue placeholder="انتخاب موضوع" />
                          </SelectTrigger>

                          <SelectContent>
                            {SUBJECTS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {errors.subject && (
                          <p className="text-xs text-destructive">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">پیام *</Label>

                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="پیام خود را اینجا بنویسید..."
                        className="resize-none bg-white dark:bg-zinc-800"
                        {...register("message")}
                      />

                      {errors.message && (
                        <p className="text-xs text-destructive">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="ml-2 h-4 w-4" />
                          ارسال پیام
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
