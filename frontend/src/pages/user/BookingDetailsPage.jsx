import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
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
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import useBookingStore from "@/store/bookingStore";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const { fetchBookingById, cancelBooking } = useBookingStore((state) => state);

  const fetchBookingDetails = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetchBookingById(id);
      setBooking(response.data.booking);
    } catch (error) {
      toast.error("Failed to load booking details");
      console.log(error);
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, fetchBookingById]);

  const handleCancelBooking = async () => {
    if (!id || !cancellationReason) return;

    setIsCancelling(true);
    try {
      await cancelBooking(id, cancellationReason);
      toast.success("Booking cancelled successfully");
      fetchBookingDetails();
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.log(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    // Generate PDF invoice
    toast.success("Invoice downloaded");
  };

  const handleContactSupport = () => {
    navigate("/contact", { state: { bookingId: id } });
  };

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/bookings")}>
            Back to Bookings
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
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/bookings")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </Button>
          <Button variant="outline" size="sm" onClick={handleContactSupport}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Support
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <Card
            className={cn(
              "border-l-4",
              booking.status === "confirmed" && "border-l-green-500",
              booking.status === "pending" && "border-l-yellow-500",
              booking.status === "cancelled" && "border-l-red-500",
              booking.status === "completed" && "border-l-blue-500",
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Booking Status
                  </p>
                  <h2 className="text-2xl font-bold capitalize">
                    {booking.status}
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
                  Booking #{booking._id.slice(-6).toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Car Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                <div className="w-48 h-32 rounded-lg overflow-hidden">
                  <img
                    src={booking.car.images[0]}
                    alt={booking.car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {booking.car.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {booking.car.brand} {booking.car.model} • {booking.car.year}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{booking.car.transmission}</Badge>
                    <Badge variant="outline">{booking.car.fuelType}</Badge>
                    <Badge variant="outline">{booking.car.seats} seats</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rental Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Pickup Date
                  </p>
                  <p className="font-semibold">{format(startDate, "PPPP")}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, "p")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Return Date
                  </p>
                  <p className="font-semibold">{format(endDate, "PPPP")}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(endDate, "p")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                {booking.pickupLocation && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pickup Location
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-medium">{booking.pickupLocation}</p>
                    </div>
                  </div>
                )}

                {booking.dropoffLocation && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Dropoff Location
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-medium">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                )}
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Special Requests
                    </p>
                    <p className="text-sm">{booking.specialRequests}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {formatCurrency(booking.car.pricePerDay)} x {daysCount} days
                </span>
                <span>
                  {formatCurrency(booking.car.pricePerDay * daysCount)}
                </span>
              </div>

              {daysCount >= 7 && (
                <div className="flex justify-between text-green-600">
                  <span>Weekly discount (10%)</span>
                  <span>
                    -{formatCurrency(booking.car.pricePerDay * daysCount * 0.1)}
                  </span>
                </div>
              )}

              {daysCount >= 30 && (
                <div className="flex justify-between text-green-600">
                  <span>Monthly discount (20%)</span>
                  <span>
                    -{formatCurrency(booking.car.pricePerDay * daysCount * 0.2)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>Free cancellation up to 48 hours before pickup</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    50% refund for cancellations 24-48 hours before pickup
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    No refund for cancellations less than 24 hours before pickup
                  </span>
                </li>
              </ul>

              {booking.status === "confirmed" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-4">
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to cancel?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for cancellation. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Reason for cancellation..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelBooking}
                        disabled={!cancellationReason || isCancelling}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isCancelling
                          ? "Cancelling..."
                          : "Confirm Cancellation"}
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
