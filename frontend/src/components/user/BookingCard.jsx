import { useNavigate } from "react-router-dom";
import { differenceInDays, isWithinInterval } from "date-fns";
import {
  Calendar,
  MapPin,
  MoreVertical,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Phone,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const BookingCard = ({ booking, onCancel, onViewDetails, onModify }) => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const today = new Date();
  const daysUntilStart = differenceInDays(startDate, today);
  const isUpcoming = daysUntilStart > 0;
  const isOngoing = isWithinInterval(today, { start: startDate, end: endDate });
  const isPast = today > endDate;

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "در انتظار تایید",
        variant: "warning",
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Clock,
      },
      confirmed: {
        label: "تایید شده",
        variant: "default",
        color: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: CheckCircle,
      },
      active: {
        label: "در حال انجام",
        variant: "default",
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        icon: Calendar,
      },
      completed: {
        label: "تکمیل شده",
        variant: "secondary",
        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        icon: CheckCircle,
      },
      cancelled: {
        label: "لغو شده",
        variant: "destructive",
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  // Determine if actions are available
  const canCancel =
    ["pending", "confirmed"].includes(booking.status) && isUpcoming;
  const canModify =
    ["pending", "confirmed"].includes(booking.status) &&
    isUpcoming &&
    daysUntilStart > 2;
  const canViewInvoice = ["confirmed", "active", "completed"].includes(
    booking.status,
  );

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(booking._id);
    } else {
      navigate(`/bookings/${booking._id}`);
    }
  };

  const handleModify = () => {
    if (onModify) {
      onModify(booking._id);
    } else {
      navigate(`/bookings/${booking._id}/modify`);
    }
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(booking._id);
    }
    setShowCancelDialog(false);
  };

  const handleDownloadInvoice = () => {
    // Navigate to invoice or trigger download
    navigate(`/bookings/${booking._id}/invoice`);
    toast.success("در حال دریافت فاکتور...");
  };

  const handleContactSupport = () => {
    navigate("/contact", { state: { bookingId: booking._id } });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={booking.car?.images?.[0].url || "/placeholder-car.jpg"}
            alt={booking.car?.name || "موتر"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <Badge
            className={cn(
              "absolute top-3 left-3 px-3 py-1 gap-1",
              statusConfig.color,
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </Badge>

          {/* Booking ID */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-black/50 backdrop-blur text-white border-0"
            >
              #{booking._id?.slice(-6).toUpperCase()}
            </Badge>
          </div>

          {/* Car Info */}
          <div className="absolute bottom-3 right-3 text-white">
            <h3 className="font-semibold text-lg">
              {booking.car?.name || "نام موتر"}
            </h3>
            <p className="text-sm opacity-90">
              {booking.car?.brand} {booking.car?.carModel} • {booking.car?.year}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Date Range and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>

            {/* Timeline Badge */}
            {isUpcoming && (
              <Badge variant="outline" className="text-xs">
                {daysUntilStart} روز دیگر
              </Badge>
            )}
            {isOngoing && (
              <Badge className="text-xs bg-blue-500 text-white">
                در حال انجام
              </Badge>
            )}
            {isPast && booking.status === "completed" && (
              <Badge variant="secondary" className="text-xs">
                پایان یافته
              </Badge>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center mb-2 text-sm">
            <Clock className="w-4 h-4 ml-2 text-muted-foreground" />
            <span>
              {booking.days || differenceInDays(endDate, startDate)} روز
            </span>
          </div>

          {/* Payment Status */}
          {booking.paymentStatus && (
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <Badge
                variant={
                  booking.paymentStatus === "paid" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {booking.paymentStatus === "paid"
                  ? "پرداخت شده"
                  : "در انتظار پرداخت"}
              </Badge>
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">مبلغ کل</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(booking.totalPrice)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleViewDetails}>
                جزئیات
              </Button>

              {(canCancel || canModify || canViewInvoice) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canModify && (
                      <DropdownMenuItem onClick={handleModify}>
                        <Edit className="w-4 h-4 ml-2" />
                        ویرایش رزرو
                      </DropdownMenuItem>
                    )}

                    {canViewInvoice && (
                      <DropdownMenuItem onClick={handleDownloadInvoice}>
                        <FileText className="w-4 h-4 ml-2" />
                        دانلود فاکتور
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={handleContactSupport}>
                      <Phone className="w-4 h-4 ml-2" />
                      تماس با پشتیبانی
                    </DropdownMenuItem>

                    {canCancel && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleCancelClick}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4 ml-2" />
                          لغو رزرو
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Warning for upcoming booking */}
          {canModify && daysUntilStart <= 2 && (
            <div className="mt-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                کمتر از ۴۸ ساعت تا شروع سفر باقی مانده است
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از لغو رزرو اطمینان دارید؟</AlertDialogTitle>
            <AlertDialogDescription>
              با لغو این رزرو، مبلغ پرداختی طبق قوانین کنسلی به حساب شما
              بازگردانده خواهد شد.
              {daysUntilStart <= 2 && (
                <span className="block mt-2 text-destructive">
                  توجه: به دلیل نزدیکی به تاریخ سفر، ممکن است هزینه کنسلی شامل
                  حال شما شود.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive hover:bg-destructive/90"
            >
              بله، رزرو را لغو کن
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
