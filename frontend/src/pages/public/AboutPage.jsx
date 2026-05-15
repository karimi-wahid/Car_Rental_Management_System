import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Shield,
  Clock,
  Star,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const stats = [
  { value: "۵۰۰+", label: "موتر در ناوگان" },
  { value: "۱۲,۰۰۰+", label: "مشتری راضی" },
  { value: "۸", label: "سال تجربه" },
  { value: "۲۴/۷", label: "پشتیبانی" },
];

const values = [
  {
    icon: Shield,
    title: "اطمینان و امنیت",
    description:
      "تمام موترهای ما به صورت منظم بررسی فنی می‌شوند و بیمه کامل دارند.",
  },
  {
    icon: Clock,
    title: "تحویل به موقع",
    description:
      "موتر شما دقیقاً در زمان و مکان مورد نظر آماده تحویل خواهد بود.",
  },
  {
    icon: Star,
    title: "کیفیت بی‌نظیر",
    description:
      "ناوگان ما از برترین برندهای جهان تشکیل شده تا بهترین تجربه را داشته باشید.",
  },
  {
    icon: Users,
    title: "تیم حرفه‌ای",
    description: "کارشناسان ما همیشه آماده پاسخگویی و راهنمایی شما هستند.",
  },
];

const team = [
  { name: "احمد کریمی", role: "مدیر عامل", initials: "AK" },
  { name: "مریم نوری", role: "مدیر عملیات", initials: "MN" },
  { name: "سعید رحیمی", role: "مدیر فنی", initials: "SR" },
  { name: "فاطمه احمدی", role: "مدیر مشتریان", initials: "FA" },
];

const milestones = [
  { year: "۱۳۹۵", event: "تأسیس شرکت با ۱۵ موتر" },
  { year: "۱۳۹۷", event: "گسترش به ۱۰۰ موتر لوکس" },
  { year: "۱۴۰۵", event: "راه‌اندازی پلتفرم آنلاین" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden dark:bg-zinc-950 dark:text-white text-black py-28 px-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
          }}
        />
        <motion.div
          variants={itemVariants}
          className="relative max-w-4xl mx-auto text-center"
        >
          <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5">
            درباره ما
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            کرایه موتر لوکس
            <br />
            <span className="dark:text-zinc-400">با خدمات بی‌نظیر</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            از سال ۱۳۹۵، ما بهترین تجربه کرایه موتر را با ناوگانی از برترین
            خودروهای جهان و خدمات ۲۴ ساعته ارائه می‌دهیم.
          </p>
          <div className="flex gap-4 justify-center mt-10">
            <Button
              size="lg"
              onClick={() => {
                navigate("/cars");
                scrollTo(0, 0);
              }}
              className="dark:bg-white bg-primary text-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              <Car className="ml-2 w-5 h-5" />
              مشاهده موترها
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                navigate("/contact");
                scrollTo(0, 0);
              }}
              className="dark:border-white/30 dark:text-white border-black hover:bg-white/10"
            >
              تماس با ما
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="mb-4">
              داستان ما
            </Badge>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6 leading-snug">
              از یک رویا تا بزرگترین
              <br />
              ناوگان موتر لوکس
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-4">
              شرکت ما در سال ۱۳۹۵ با ۱۵ موتر و یک تیم کوچک ۵ نفره آغاز به کار
              کرد. هدف ما از ابتدا ساده بود: ارائه بهترین تجربه کرایه موتر با
              بالاترین استانداردهای کیفیت و خدمات مشتری.
            </p>
            <p className="text-zinc-500 leading-relaxed mb-6">
              امروز با بیش از ۵۰۰ موتر از برترین برندهای جهان، هزاران مشتری
              راضی، و تیمی از ۸۰ متخصص حرفه‌ای، به عنوان پیشرو در صنعت کرایه
              موتر لوکس شناخته می‌شویم.
            </p>
            <div className="space-y-3">
              {[
                "بیمه کامل برای تمام موترها",
                "تحویل در هر نقطه شهر",
                "پشتیبانی ۲۴ ساعته",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-5 relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-white mt-1 shrink-0 z-10" />
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700 mt-1" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-semibold text-primary mb-1 block">
                    {m.year}
                  </span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-14">
            <Badge variant="outline" className="mb-4">
              ارزش‌های ما
            </Badge>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              چرا ما را انتخاب کنید؟
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div variants={itemVariants} className="text-center mb-14">
          <Badge variant="outline" className="mb-4">
            تیم ما
          </Badge>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            افرادی که پشت موفقیت ما هستند
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                <span className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                  {member.initials}
                </span>
              </div>
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                {member.name}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Contact Strip ─────────────────────────────── */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              با ما در ارتباط باشید
            </h2>
            <p className="text-zinc-500 text-sm">هر سوالی دارید، ما اینجاییم</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                label: "آدرس",
                value: "کابل، ناحیه سوم، سرک دارالامان",
              },
              { icon: Phone, label: "تلفن", value: "+93 700 123 456" },
              { icon: Mail, label: "ایمیل", value: "info@luxcar.af" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
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
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="dark:bg-zinc-950 dark:text-white py-20 px-6 text-center">
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">آماده شروع سفر هستید؟</h2>
          <p className="text-zinc-400 mb-8">
            از بین بیش از ۵۰۰ موتر لوکس انتخاب کنید و همین امروز رزرو کنید.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => {
                navigate("/cars");
                scrollTo(0, 0);
              }}
              className="dark:bg-white dark:text-zinc-950 bg-primary text-white hover:bg-zinc-100"
            >
              <Car className="ml-2 w-5 h-5" />
              رزرو موتر
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                navigate(-1);
                scrollTo(0, 0);
              }}
              className="text-zinc-400 dark:hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="ml-2 w-5 h-5" />
              بازگشت
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
