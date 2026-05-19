import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Share2,
  Clock,
  Star,
  Loader2,
  CheckCircle,
  Fuel,
  Gauge,
  Users,
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingCalendar } from "@/components/cars/BookingCalendar";
import { CarSpecs } from "@/components/cars/CarSpecs";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import useCarStore from "@/store/carStore";
import useBookingStore from "@/store/bookingStore";
import FavoriteButton from "@/components/cars/FavoriteButton";
import { CarReviews } from "@/components/cars/CarReviews";
import { CarComments } from "@/components/cars/CarComments";
import { cn } from "@/lib/utils";

const FUEL_MAP = {
  petrol: "پطرول",
  diesel: "دیزل",
  electric: "برقی",
  hybrid: "هایبرید",
};
const TRANS_MAP = { automatic: "اتوماتیک", manual: "دستی" };

// ── Fullscreen Gallery ─────────────────────────────────────────
const FullscreenGallery = ({ images, initial, onClose }) => {
  const [current, setCurrent] = useState(initial);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 left-5 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <motion.img
        key={current}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        src={images[current]?.url || images[current]}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-white" : "w-2 bg-white/30",
            )}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ── Image Strip ────────────────────────────────────────────────
const ImageStrip = ({ images, carName }) => {
  const [gallery, setGallery] = useState(null);
  const main = images?.[0]?.url || images?.[0] || "/placeholder-car.jpg";
  const thumbs = images?.slice(1, 5) || [];

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-105 md:h-130">
        {/* Main large image */}
        <div
          className="col-span-3 row-span-2 relative overflow-hidden rounded-2xl cursor-zoom-in"
          onClick={() => setGallery(0)}
        >
          <motion.img
            src={main}
            alt={carName}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>

        {/* Thumbnails */}
        {[0, 1, 2, 3].map((i) => {
          const src = thumbs[i]?.url || thumbs[i];
          return (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-xl cursor-pointer",
                i === 3 && images.length > 5 ? "relative" : "",
              )}
              onClick={() => src && setGallery(i + 1)}
            >
              {src ? (
                <>
                  <motion.img
                    src={src}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                  {i === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800" />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {gallery !== null && (
          <FullscreenGallery
            images={images}
            initial={gallery}
            onClose={() => setGallery(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ── Quick Spec Pill ────────────────────────────────────────────
const SpecPill = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center gap-1.5 px-5 py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
    <Icon className="w-4 h-4 text-zinc-400" />
    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
      {value}
    </span>
    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

// ── Tab Button ─────────────────────────────────────────────────
const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "text-sm font-medium pb-3 border-b-2 transition-all duration-200 whitespace-nowrap",
      active
        ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
        : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
    )}
  >
    {children}
  </button>
);

// ── Main Page ──────────────────────────────────────────────────
const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [completedBookingId, setCompletedBookingId] = useState(null);

  const { selectedCar: car, loading, fetchCarById } = useCarStore();
  const { createBooking, userBookings, fetchUserBookings, error } =
    useBookingStore();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    if (id) {
      fetchCarById(id);
      if (isAuthenticated) fetchUserBookings({ page: 1, limit: 50 });
    }
  }, [id]);

  useEffect(() => {
    if (!userBookings?.length || !id) return;
    const completed = userBookings.find(
      (b) => b.car?._id === id && b.status === "completed",
    );
    setCompletedBookingId(completed?._id || null);
  }, [userBookings, id]);

  const handleBooking = async (startDate, endDate) => {
    if (!isAuthenticated) {
      toast.error("لطفاً برای رزرو موتر وارد حساب خود شوید");
      navigate("/login", { state: { from: `/cars/${id}` } });
      return;
    }
    setBookingLoading(true);
    try {
      await createBooking({
        carId: id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      toast.success("رزرو موفقانه انجام شد!");
      navigate("/bookings");
    } catch {
      toast.error(error || "رزرو ناموفق بود");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: car?.name, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک کپی شد");
    }
  };

  // ── Loading ──
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 tracking-widest uppercase">
            در حال بارگذاری
          </p>
        </div>
      </div>
    );

  // ── Not found ──
  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-zinc-400 mb-6 text-sm">موتر مورد نظر یافت نشد</p>
          <Button onClick={() => navigate("/cars")} variant="outline">
            بازگشت به موترها
          </Button>
        </div>
      </div>
    );

  const specs = [
    { icon: Users, label: "ظرفیت", value: `${car.seats} نفر` },
    {
      icon: Fuel,
      label: "سوخت",
      value: FUEL_MAP[car.fuelType] || car.fuelType,
    },
    {
      icon: Gauge,
      label: "کیلومتر",
      value: car.mileage ? Number(car.mileage).toLocaleString("fa-IR") : "—",
    },
    { icon: Calendar, label: "سال", value: car.year },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-zinc-950 min-h-screen"
      dir="rtl"
    >
      {/* ── Sticky top bar ─────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </button>

          <div className="hidden md:block text-sm font-medium text-zinc-900 dark:text-white truncate max-w-xs">
            {car.name}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <FavoriteButton carId={car._id} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* ── Hero section ───────────────────────────── */}
        <div className="mb-10">
          {/* Title above gallery */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {car.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-zinc-400 mt-1.5 text-base"
              >
                {car.brand} · {car.carModel} · {car.year}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-left"
            >
              <p
                className="text-4xl font-black text-zinc-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {formatCurrency(car.pricePerDay)}
              </p>
              <p className="text-xs text-zinc-400 mt-1 tracking-widest uppercase">
                فی روز
              </p>
            </motion.div>
          </div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ImageStrip images={car.images} carName={car.name} />
          </motion.div>
        </div>

        {/* ── Two column layout ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Left/Main column ──────────────────────── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick specs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-4 gap-3"
            >
              {specs.map((s) => (
                <SpecPill key={s.label} {...s} />
              ))}
            </motion.div>

            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {car.availability ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  موجود برای رزرو
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                  غیر موجود
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                تایید فوری
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                بیمه کامل
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full">
                {TRANS_MAP[car.transmission] || car.transmission}
              </span>
            </div>

            <Separator />

            {/* Tab nav */}
            <div className="flex gap-8 border-b border-zinc-100 dark:border-zinc-800">
              {[
                { id: "specs", label: "مشخصات فنی" },
                { id: "features", label: "امکانات" },
                { id: "policy", label: "شرایط کرایه" },
              ].map((t) => (
                <TabBtn
                  key={t.id}
                  active={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </TabBtn>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "specs" && <CarSpecs car={car} />}

                {activeTab === "features" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features?.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white shrink-0" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "policy" && (
                  <div className="space-y-3">
                    {[
                      {
                        icon: ShieldCheck,
                        text: "گواهینامه معتبر رانندگی ضروری است",
                      },
                      { icon: Users, text: "حداقل سن راننده: ۱۸ سال" },
                      {
                        icon: MapPin,
                        text: "تحویل در محل: رایگان برای رزرو بالای ۳ روز",
                      },
                      {
                        icon: Clock,
                        text: "لغو رایگان تا ۲۴ ساعت قبل از تحویل",
                      },
                      { icon: Gauge, text: "کیلومتراژ نامحدود شامل قیمت است" },
                      { icon: Star, text: "کمک‌رسانی ۲۴/۷ در طول کرایه" },
                    ].map(({ icon: Icon, text }, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <Separator />

            {/* Reviews + Comments */}
            <CarReviews carId={car._id} bookingId={completedBookingId} />
            <CarComments carId={car._id} />
          </div>

          {/* ── Booking widget column ──────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
              >
                {/* Price header */}
                <div className="bg-zinc-950 dark:bg-zinc-900 p-5 flex items-baseline justify-between">
                  <div>
                    <span
                      className="text-2xl font-black text-white"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {formatCurrency(car.pricePerDay)}
                    </span>
                    <span className="text-zinc-500 text-sm mr-2">/ روز</span>
                  </div>
                  {car.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-sm font-medium text-white">
                        {car.averageRating}
                      </span>
                      {car.numRatings > 0 && (
                        <span className="text-xs text-zinc-500">
                          ({car.numRatings})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Calendar widget */}
                <div className="bg-white dark:bg-zinc-950 p-1">
                  <BookingCalendar
                    pricePerDay={car.pricePerDay}
                    carId={car._id}
                    onBookingSubmit={handleBooking}
                    disabled={!car.availability || bookingLoading}
                  />
                </div>
              </motion.div>

              {/* Trust signals */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, text: "بیمه کامل" },
                  { icon: Clock, text: "تایید فوری" },
                  { icon: MapPin, text: "تحویل در محل" },
                  { icon: Star, text: "۲۴/۷ پشتیبانی" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetailsPage;
