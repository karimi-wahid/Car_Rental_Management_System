import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Car,
  CreditCard,
  FileText,
  AlertCircle,
  Download,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import useBookingStore from "@/store/bookingStore";
import { BookingInvoice } from "@/components/common/BookingInvoice";
import { useAuthStore } from "@/store/authStore";

const BookingDetailsPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const booking = useBookingStore((state) => state.selectedBooking);
  const loading = useBookingStore((state) => state.loading);
  const { fetchBookingById, cancelBooking } = useBookingStore();
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    if (!carId) return;

    try {
      await fetchBookingById(carId);
    } catch (error) {
      toast.error("بارگذاری جزئیات رزرو ناموفق بود");
      console.log(error);
      navigate("/bookings");
    }
  }, [carId, navigate, fetchBookingById]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handleCancelBooking = async () => {
    if (!carId || !cancellationReason) return;

    setIsCancelling(true);
    try {
      await cancelBooking(carId, cancellationReason);
      toast.success("رزرو موفقانه لغو شد");
      fetchBookingDetails();
    } catch (error) {
      toast.error("لغو رزرو ناموفق بود");
      console.log(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContactSupport = () => {
    navigate("/contact", { state: { bookingId: carId } });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "تایید شده";
      case "pending":
        return "در انتظار";
      case "cancelled":
        return "لغو شده";
      case "completed":
        return "تکمیل شده";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            در حال بارگذاری جزئیات رزرو...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-100 flex items-center justify-center" dir="rtl">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">رزرو یافت نشد</h2>
          <p className="text-muted-foreground mb-4">
            رزرو مورد نظر شما وجود ندارد یا حذف شده است.
          </p>
          <Button onClick={() => navigate("/bookings")}>
            بازگشت به رزروها
          </Button>
        </Card>
      </div>
    );
  }

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const daysCount = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/bookings")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به رزروها
        </Button>

        <div className="flex gap-2">
          {booking.status === "confirmed" && user.role === "admin" && (
            <Button onClick={() => setShowInvoice(true)}>
              <Download className="w-4 h-4 ml-2" />
              دانلود فاکتور
            </Button>
          )}
          {showInvoice && (
            <BookingInvoice
              booking={booking}
              onClose={() => setShowInvoice(false)}
            />
          )}
          <Button variant="outline" size="sm" onClick={handleContactSupport}>
            <MessageCircle className="w-4 h-4 ml-2" />
            پشتیبانی
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <Card
            className={cn(
              "border-r-4",
              booking.status === "confirmed" && "border-r-green-500",
              booking.status === "pending" && "border-r-yellow-500",
              booking.status === "cancelled" && "border-r-red-500",
              booking.status === "completed" && "border-r-blue-500",
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    وضعیت رزرو
                  </p>
                  <h2 className="text-2xl font-bold">
                    {getStatusText(booking.status)}
                  </h2>
                </div>
                <Badge
                  className={cn(
                    "px-4 py-2",
                    booking.status === "confirmed" && "bg-green-500",
                    booking.status === "pending" && "bg-yellow-500",
                    booking.status === "cancelled" && "bg-red-500",
                    booking.status === "completed" && "bg-blue-500",
                  )}
                >
                  رزرو شماره #{booking._id.slice(-6).toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 ml-2" />
                جزئیات موتر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="w-48 h-32 rounded-lg overflow-hidden">
                  <img
                    src={booking.car.images[0]?.url}
                    alt={booking.car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold mb-1">
                    {booking.car.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {booking.car.brand} {booking.car.carModel} •{" "}
                    {booking.car.year}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Badge variant="outline">
                      {booking.car.transmission === "automatic"
                        ? "اتوماتیک"
                        : "گیر"}
                    </Badge>
                    <Badge variant="outline">
                      {booking.car.fuelType === "petrol"
                        ? "پطرول"
                        : booking.car.fuelType === "diesel"
                          ? "دیزل"
                          : booking.car.fuelType === "electric"
                            ? "برقی"
                            : booking.car.fuelType === "hybrid"
                              ? "هایبرید"
                              : booking.car.fuelType}
                    </Badge>
                    <Badge variant="outline">{booking.car.seats} چوکی</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 ml-2" />
                جزئیات کرایه
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    تاریخ شروع
                  </p>
                  <p className="font-semibold">{formatDate(startDate)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, "HH:mm")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    تاریخ ختم
                  </p>
                  <p className="font-semibold">{formatDate(endDate)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(endDate, "HH:mm")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 ml-2" />
                خلاصه قیمت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  {formatCurrency(booking.car.pricePerDay * daysCount)}
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(booking.car.pricePerDay)} × {daysCount} روز
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span className="text-primary">
                  {formatCurrency(booking.totalPrice)}
                </span>
                <span>مجموع</span>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 ml-2" />
                شرایط لغو
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-right">
                    لغو رایگان تا ۱ روز قبل از تحویل
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-right">
                    ۵۰٪ بازپرداخت برای لغو ۲۴ تا ۴۸ ساعت قبل از تحویل
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-right">
                    عدم بازپرداخت برای لغو کمتر از ۲۴ ساعت قبل از تحویل
                  </span>
                </li>
              </ul>

              {booking.status === "confirmed" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-4">
                      لغو رزرو
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-right">
                        آیا مطمئن هستید که می‌خواهید لغو کنید؟
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-right">
                        لطفاً دلیل لغو را وارد کنید. این اقدام قابل بازگشت نیست.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="دلیل لغو..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <AlertDialogFooter className="flex-row-reverse sm:flex-row-reverse">
                      <AlertDialogCancel>حفظ رزرو</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelBooking}
                        disabled={!cancellationReason || isCancelling}
                        className="bg-destructive hover:bg-destructive/90 mr-2 sm:mr-0 sm:ml-2"
                      >
                        {isCancelling ? "در حال لغو..." : "تایید لغو"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetailsPage;
