import { useState } from "react";
import { motion } from "motion/react";
import { addDays } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";

export const BookingCalendar = ({ pricePerDay, onBookingSubmit, disabled }) => {
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });
  const [totalPrice, setTotalPrice] = useState(null);

  const handleDateSelect = (range) => {
    setDate(range);

    if (range?.from && range?.to) {
      const days = Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Apply discounts
      let discount = 0;
      if (days >= 7) discount = 0.1;
      if (days >= 30) discount = 0.2;

      const total = pricePerDay * days * (1 - discount);
      setTotalPrice(total);
    } else {
      setTotalPrice(null);
    }
  };

  const handleBooking = () => {
    if (date.from && date.to) {
      onBookingSubmit(date.from, date.to);
    }
  };

  // Disable past dates and dates more than 1 year in advance
  const disabledDays = {
    before: new Date(),
    after: addDays(new Date(), 365),
  };

  const numberOfDays =
    date.from && date.to
      ? Math.ceil(
          (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <Card className="sticky top-24" dir="rtl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-right">رزرو این موتر</h3>

        {/* Price Display */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold gradient-text">
              {formatCurrency(pricePerDay)}
            </span>
            <span className="text-muted-foreground">فی روز</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Calendar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-primary ml-2" />
            <span className="font-medium">انتخاب مدت زمان رزرو</span>
          </div>

          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            numberOfMonths={1}
            className="rounded-md border"
          />
        </div>

        {/* Booking Summary */}
        {date.from && date.to && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-muted/30 rounded-lg"
          >
            <h4 className="font-semibold mb-3 text-right">خلاصه رزرو</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{formatDate(date.from)}</span>
                <span className="text-muted-foreground">تاریخ شروع</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{formatDate(date.to)}</span>
                <span className="text-muted-foreground">تاریخ ختم</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">{numberOfDays} روز</span>
                <span className="text-muted-foreground">مدت زمان</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-semibold">
                <span className="text-primary">
                  {formatCurrency(totalPrice)}
                </span>
                <span>مجموع</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <Button
          className="w-full"
          size="lg"
          disabled={!date.from || !date.to || disabled}
          onClick={handleBooking}
        >
          {!date.from || !date.to
            ? "انتخاب تاریخ‌ها"
            : `رزرو کردن - ${formatCurrency(totalPrice)}`}
        </Button>

        {/* Trust Badges */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
            <span>لغو رایگان</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
            <span>ضمانت بهترین قیمت</span>
          </div>
        </div>

        {/* Availability Note */}
        {disabled && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5 ml-2" />
              <p className="text-sm text-yellow-600 text-right">
                این موتر در حال حاضر غیرقابل دسترس است. لطفاً بعداً مراجعه کنید
                یا گزینه‌های دیگر را مشاهده نمایید.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
