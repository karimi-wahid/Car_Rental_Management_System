import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
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

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "آدرس",
    value: "کابل، ناحیه سوم، سرک دارالامان، مقابل پارک",
  },
  { icon: Phone, label: "تلفن", value: "+93 700 123 456" },
  { icon: Mail, label: "ایمیل", value: "info@luxcar.af" },
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
    a: "بله، تا ۲۴ ساعت قبل از شروع رزرو می‌توانید آن را لغو کنید. شرایط استرداد وجه بستگی به زمان لغو دارد.",
  },
  {
    q: "چه مدارکی برای کرایه موتر نیاز است؟",
    a: "گواهینامه معتبر رانندگی و کارت ملی یا پاسپورت الزامی است. برای برخی موترها سند ضمانت نیز لازم است.",
  },
  {
    q: "آیا تحویل در محل امکان‌پذیر است؟",
    a: "بله، برای رزروهای بالای ۳ روز، تحویل در محل رایگان انجام می‌شود.",
  },
];

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-right hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <span className="font-medium text-sm text-zinc-900 dark:text-white">
          {faq.q}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0 ml-3" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-3" />
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
            <p className="px-5 pb-5 text-sm text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
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
      {/* ── Hero ───────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Badge className="mb-4 bg-white/10 text-white border-white/20">
            تماس با ما
          </Badge>
          <h1 className="text-4xl font-bold mb-4">چطور می‌توانیم کمک کنیم؟</h1>
          <p className="text-zinc-400">
            تیم ما آماده پاسخگویی به سوالات و حل مشکلات شماست.
          </p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ── Left: Contact Info ─────────────────── */}
          <div className="space-y-8">
            {/* Info cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                سوالات متداول
              </h3>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {success ? (
                /* Success state */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 14 }}
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    پیام شما ارسال شد!
                  </h2>
                  <p className="text-zinc-500 mb-2">
                    از تماس شما متشکریم. تیم ما به زودی پاسخ خواهد داد.
                  </p>
                  {trackingId && (
                    <p className="text-xs text-zinc-400 font-mono mb-6">
                      شماره پیگیری: {trackingId.slice(-8).toUpperCase()}
                    </p>
                  )}
                  <Button variant="outline" onClick={() => setSuccess(false)}>
                    ارسال پیام جدید
                  </Button>
                </motion.div>
              ) : (
                /* Form */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8"
                >
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                    ارسال پیام
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">نام کامل *</Label>
                        <Input
                          id="name"
                          placeholder="محمد احمدی"
                          className="bg-white dark:bg-zinc-800"
                          {...register("name", {
                            required: "نام الزامی است",
                            minLength: {
                              value: 2,
                              message: "نام خیلی کوتاه است",
                            },
                          })}
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
                          {...register("email", {
                            required: "ایمیل الزامی است",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "ایمیل نامعتبر است",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">پیام *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="پیام خود را اینجا بنویسید..."
                        className="bg-white dark:bg-zinc-800 resize-none"
                        {...register("message", {
                          required: "پیام الزامی است",
                          minLength: {
                            value: 10,
                            message: "پیام باید حداقل ۱۰ کاراکتر باشد",
                          },
                          maxLength: {
                            value: 2000,
                            message: "پیام نباید از ۲۰۰۰ کاراکتر بیشتر باشد",
                          },
                        })}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        "در حال ارسال..."
                      ) : (
                        <>
                          <Send className="ml-2 w-4 h-4" />
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
