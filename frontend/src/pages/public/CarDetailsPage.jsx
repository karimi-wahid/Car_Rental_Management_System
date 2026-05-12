import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Share2, Heart, Clock, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/cars/ImageGallery";
import { BookingCalendar } from "@/components/cars/BookingCalendar";
import { CarSpecs } from "@/components/cars/CarSpecs";
import { RelatedCars } from "@/components/cars/RelatedCars";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import useCarStore from "@/store/carStore";
import useBookingStore from "@/store/bookingStore";
import FavoriteButton from "@/components/cars/FavoriteButton";
import { CarReviews } from "@/components/cars/CarReviews";
import { CarComments } from "@/components/cars/CarComments";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [bookingLoading, setBookingLoading] = useState(false);
  const { selectedCar: car, loading, fetchCarById } = useCarStore();
  const { createBooking, userBookings, error } = useBookingStore();
  const [completedBookingId, setCompletedBookingId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCarById(id);
    }
  }, [id, fetchCarById]);

  useEffect(() => {
    if (!userBookings || !id) return;

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
      console.log("Creating booking with:", {
        carId: id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      await createBooking({
        carId: id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      toast.success("رزرو موفقانه انجام شد!");
      navigate("/bookings");
    } catch (err) {
      console.log("Booking error:", error);
      toast.error(error || "رزرو ناموفق بود");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: car?.name,
          text: `این ${car?.name} را در کرایه موتر ببینید`,
          url: window.location.href,
        });
      } catch (error) {
        console.log(error);
        console.log("اشتراک‌گذاری لغو شد");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک در کلیپ‌بورد کپی شد!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            در حال بارگذاری جزئیات موتر...
          </p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">موتر یافت نشد</h2>
          <p className="text-muted-foreground mb-4">
            موتری که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
          <Button onClick={() => navigate("/cars")}>مشاهده موترهای دیگر</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-8 px-2.5"
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <FavoriteButton carId={car._id} />
        </div>
      </div>

      <Breadcrumb className="mb-6" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Column - Gallery and Details (appears on right in RTL) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <ImageGallery images={car.images} carName={car.name} />

          {/* Car Title and Basic Info */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-display font-bold mb-2 text-right">
                  {car.name}
                </h1>
                <p className="text-xl text-muted-foreground text-right">
                  {car.brand} {car.carModel} • {car.year}
                </p>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold gradient-text">
                  {formatCurrency(car.pricePerDay)}
                </div>
                <p className="text-sm text-muted-foreground">فی روز</p>
              </div>
            </div>

            {/* Quick Info Badges */}
            <div className="flex flex-wrap gap-3 mb-6 justify-end">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="w-3 h-3 ml-1" />
                تایید فوری
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="w-3 h-3 ml-1" />
                وضعیت عالی
              </Badge>
            </div>

            <Separator />
          </div>

          {/* Tabs for Specifications and Details */}
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="policy">شرایط رزرو</TabsTrigger>
              <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-6">
              <CarSpecs car={car} />
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="policy" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-right">شرایط کرایه</h3>
                <ul className="space-y-2 text-muted-foreground text-right">
                  <li>گواهینامه معتبر رانندگی ضروری است •</li>
                  <li>حداقل سن: ۱۸ سال •</li>
                  <li>ودیعه امنیتی: سند خانه •</li>
                  <li>لغو رایگان تا ۳۰ دقیقه قبل از تحویل •</li>
                  <li>کیلومتراژ نامحدود شامل است •</li>
                  <li>کمک‌رسانی ۲۴/۷ •</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Left Column - Booking Widget */}
        <div className="lg:col-span-1">
          <BookingCalendar
            pricePerDay={car.pricePerDay}
            carId={car._id}
            onBookingSubmit={handleBooking}
            disabled={!car.availability || bookingLoading}
          />
        </div>
      </div>

      <CarReviews carId={car._id} bookingId={completedBookingId} />
      <CarComments carId={car._id} />
      {/* Related Cars */}
      {/* <RelatedCars currentCarId={car._id} /> */}
    </motion.div>
  );
};

export default CarDetailsPage;
