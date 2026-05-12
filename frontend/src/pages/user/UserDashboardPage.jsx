import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthStore } from "@/store/authStore";
//import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import useBookingStore from "@/store/bookingStore";
import { BookingCard } from "@/components/user/BookingCard";

// Helper function to get status badge variant
const getStatusBadge = (status) => {
  switch (status) {
    case "confirmed":
      return { variant: "default", label: "تایید شده", icon: CheckCircle };
    case "completed":
      return { variant: "secondary", label: "تکمیل شده", icon: CheckCircle };
    case "cancelled":
      return { variant: "destructive", label: "لغو شده", icon: AlertCircle };
    case "pending":
      return { variant: "outline", label: "در انتظار", icon: Clock };
    default:
      return { variant: "outline", label: status, icon: AlertCircle };
  }
};

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const {
    userBookings: bookings,
    fetchUserBookings,
    loading,
    error,
  } = useBookingStore();

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  let isLoading = loading;
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchUserBookings({ page: 1, limit: 5 });
        const { summary, upcomingBookings, recentBookings } = res.data;

        setUpcomingBookings(upcomingBookings);
        setRecentBookings(recentBookings);
        setStats({
          totalBookings: summary.totalBookings,
          totalSpent: summary.totalSpent,
          upcomingTrips: summary.upcomingTrips,
          completedTrips: summary.completedTrips,
        });
      } catch {
        toast.error("خطا در دریافت اطلاعات داشبورد");
      }
    };

    loadDashboard();
  }, [fetchUserBookings]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <PageHeader
        title={`خوش آمدید، ${user?.name || "کاربر"}!`}
        description="نمای کلی از حساب کاربری و فعالیت‌های اخیر شما"
      />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline">کل</Badge>
              </div>
              <h3 className="text-3xl font-bold">{stats.totalBookings}</h3>
              <p className="text-sm text-muted-foreground mt-1">کل رزروها</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <Badge variant="outline">هزینه</Badge>
              </div>
              <h3 className="text-xl font-bold">
                {formatCurrency(stats.totalSpent)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">کل هزینه‌ها</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <Badge variant="outline">پیش رو</Badge>
              </div>
              <h3 className="text-3xl font-bold">{stats.upcomingTrips}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                سفرهای پیش رو
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
                <Badge variant="outline">تکمیل شده</Badge>
              </div>
              <h3 className="text-3xl font-bold">{stats.completedTrips}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                سفرهای تکمیل شده
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/cars")} size="lg">
            <Plus className="ml-2 h-4 w-4" />
            رزرو موتر جدید
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/bookings")}
            size="lg"
          >
            <Calendar className="ml-2 h-4 w-4" />
            مشاهده همه رزروها
          </Button>
        </div>
      </motion.div>
      {/* Upcoming Bookings */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">سفرهای پیش رو</h2>
          <Button variant="ghost" onClick={() => navigate("/bookings")}>
            مشاهده همه
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              هیچ سفر پیش رو ندارید
            </h3>
            <p className="text-muted-foreground mb-6">
              آماده ماجراجویی جدید هستید؟ موتر رویایی خود را انتخاب و رزرو کنید.
            </p>
            <Button onClick={() => navigate("/cars")} size="lg">
              مشاهده موترها
            </Button>
          </Card>
        )}
      </motion.div>
      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">فعالیت‌های اخیر</h2>
          <Button variant="ghost" onClick={() => navigate("/bookings/history")}>
            مشاهده تاریخچه
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const statusInfo = getStatusBadge(booking.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={booking._id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/bookings/${booking._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={
                              booking.car?.images?.[0].url ||
                              "/placeholder-car.jpg"
                            }
                            alt={booking.car?.name || "موتر"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {booking.car?.name || "نام موتر"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(booking.startDate)} -{" "}
                            {formatDate(booking.endDate)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            شماره رزرو: {booking._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge variant={statusInfo.variant} className="mb-2">
                          <StatusIcon className="ml-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">بدون فعالیت اخیر</h3>
            <p className="text-muted-foreground mb-6">
              شما هنوز هیچ رزروی انجام نداده‌اید. اولین سفر خود را شروع کنید!
            </p>
            <Button onClick={() => navigate("/cars")} size="lg">
              رزرو اولین موتر
            </Button>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserDashboardPage;
