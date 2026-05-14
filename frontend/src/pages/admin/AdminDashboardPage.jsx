import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Eye,
  Star,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";
import useBookingStore from "@/store/bookingStore";
import useCarStore from "@/store/carStore";
import useUserStore from "@/store/userStore";
import { formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { users, getAllUsers } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [stats, setStats] = useState({
    overview: {
      totalUsers: 0,
      totalCars: 0,
      totalBookings: 0,
      totalRevenue: 0,
      availableCars: 0,
      occupancyRate: 0,
      avgBookingValue: 0,
      conversionRate: 0,
      newUsersToday: 0,
      pendingBookings: 0,
    },
    revenueData: [],
    bookingsByStatus: {},
    popularCars: [],
    recentActivities: [],
  });

  const { fetchAllBookings } = useBookingStore();

  const { fetchCars } = useCarStore();

  useEffect(() => {
    if (!user) return;
    const loadDashboard = async () => {
      setLoading(true);
      try {
        // Fetch data in parallel
        const [bookingRes, carRes] = await Promise.all([
          fetchAllBookings(1, 100),
          fetchCars(1, 100),
        ]);
        const bookingsData = bookingRes?.data?.bookings || [];
        const carsData = carRes?.data?.cars || [];

        // ======================
        // 📊 OVERVIEW STATS
        // ======================

        const totalRevenue = bookingsData.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );

        const pendingBookings = bookingsData.filter(
          (b) => b.status === "pending",
        ).length;

        const availableCars = carsData.filter((c) => c.availability).length;

        const occupancyRate =
          carsData.length > 0
            ? ((carsData.length - availableCars) / carsData.length) * 100
            : 0;

        // ======================
        // 📈 REVENUE CHART
        // ======================

        const revenueMap = {};

        bookingsData.forEach((b) => {
          const month = new Date(b.createdAt).toLocaleDateString("fa-AF", {
            month: "long",
          });

          if (!revenueMap[month]) {
            revenueMap[month] = 0;
          }

          revenueMap[month] += b.totalPrice || 0;
        });

        const revenueData = Object.entries(revenueMap).map(
          ([month, revenue]) => ({
            month,
            revenue,
          }),
        );

        // ======================
        // 📊 STATUS DISTRIBUTION
        // ======================

        const statusCounts = {
          pending: { count: 0, revenue: 0 },
          confirmed: { count: 0, revenue: 0 },
          completed: { count: 0, revenue: 0 },
          cancelled: { count: 0, revenue: 0 },
        };

        bookingsData.forEach((b) => {
          if (statusCounts[b.status]) {
            statusCounts[b.status].count += 1;
            statusCounts[b.status].revenue += b.totalPrice || 0;
          }
        });

        // ======================
        // 🚗 POPULAR CARS
        // ======================

        const carMap = {};

        bookingsData.forEach((b) => {
          const carId = b.car?._id;
          if (!carId) return;

          if (!carMap[carId]) {
            carMap[carId] = {
              carDetails: b.car,
              bookings: 0,
              revenue: 0,
            };
          }

          carMap[carId].bookings += 1;
          carMap[carId].revenue += b.totalPrice || 0;
        });

        const popularCars = Object.values(carMap)
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 3);

        // ======================
        // 🧾 FINAL STATE
        // ======================

        setStats({
          overview: {
            totalUsers: users.length,
            totalCars: carsData.length,
            totalBookings: bookingsData.length,
            totalRevenue,
            availableCars,
            occupancyRate: Math.round(occupancyRate),
            avgBookingValue:
              bookingsData.length > 0 ? totalRevenue / bookingsData.length : 0,
            conversionRate: 0,
            newUsersToday: 0,
            pendingBookings,
          },
          revenueData,
          bookingsByStatus: statusCounts,
          popularCars,
          recentActivities: [],
        });
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات داشبورد");
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();

    loadDashboard();
  }, [timeRange, fetchAllBookings, fetchCars, user, getAllUsers, users.length]);

  const statCards = [
    {
      title: "کل کاربران",
      value: formatNumber(stats.overview?.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      subtitle: `${stats.overview?.newUsersToday} کاربر جدید امروز`,
    },
    {
      title: "کل موترها",
      value: formatNumber(stats.overview.totalCars),
      icon: Car,
      color: "from-purple-500 to-pink-500",
      subtitle: `${stats.overview.availableCars} موتر در دسترس`,
    },
    {
      title: "کل رزروها",
      value: formatNumber(stats.overview.totalBookings),
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      subtitle: `${stats.overview.pendingBookings} در انتظار تایید`,
    },
    {
      title: "درآمد کل",
      value: formatCurrency(stats.overview.totalRevenue),
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      subtitle: `میانگین: ${formatCurrency(stats.overview.avgBookingValue)}`,
    },
  ];

  const statusData = Object.entries(stats.bookingsByStatus).map(
    ([status, data]) => ({
      name:
        status === "pending"
          ? "در انتظار"
          : status === "confirmed"
            ? "تایید شده"
            : status === "completed"
              ? "تکمیل شده"
              : "لغو شده",
      value: data.count,
      revenue: data.revenue,
      originalStatus: status,
    }),
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_created":
        return {
          icon: Users,
          color:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        };
      case "booking_created":
        return {
          icon: Calendar,
          color:
            "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        };
      case "payment_received":
        return {
          icon: DollarSign,
          color:
            "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        };
      case "car_added":
        return {
          icon: Car,
          color:
            "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        };
      case "booking_completed":
        return {
          icon: CheckCircle,
          color:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        };
      default:
        return {
          icon: Activity,
          color:
            "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            در حال بارگذاری داشبورد...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            داشبورد مدیریت
          </h1>
          <p className="text-muted-foreground">
            خوش آمدید، {user?.name || "ادمین"}! در اینجا وضعیت کسب و کار خود را
            مشاهده می‌کنید.
          </p>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-linear-to-r ${stat.color} rounded-xl`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>نمای کلی درآمد</span>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 ml-2" />
                جزئیات
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع وضعیت رزروها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    className="absolute top-20 right-5"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {statusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.value}</span>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Cars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">محبوب‌ترین موترها</h2>
          <Button variant="ghost" onClick={() => navigate("/admin/cars")}>
            مشاهده همه موترها
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {stats.popularCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.popularCars.map((car, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={
                          car.carDetails.images?.[0].url ||
                          "/placeholder-car.jpg"
                        }
                        alt={car.carDetails.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/50 backdrop-blur text-white border-0">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {car.carDetails.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {car.carDetails.brand} {car.carDetails.carModel}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{car.bookings} رزرو</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="w-full justify-center"
                      >
                        {formatCurrency(car.revenue)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">هنوز رزروی ثبت نشده</h3>
            <p className="text-muted-foreground mb-6">
              پس از ثبت اولین رزرو، محبوب‌ترین موترها اینجا نمایش داده می‌شوند.
            </p>
            <Button variant="outline" onClick={() => navigate("/admin/cars")}>
              مدیریت موترها
            </Button>
          </Card>
        )}
      </div>

      {/* Recent Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">فعالیت‌های اخیر</h2>
          <Button variant="ghost" onClick={() => navigate("/admin/activities")}>
            مشاهده همه
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        {stats.recentActivities.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              {stats.recentActivities.map((activity, index) => {
                const { icon: Icon, color } = getActivityIcon(activity.type);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString("fa-IR")}
                      </p>
                    </div>
                    {activity.amount && (
                      <Badge variant="outline" className="font-mono">
                        {formatCurrency(activity.amount)}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">هیچ فعالیتی ثبت نشده</h3>
            <p className="text-muted-foreground">
              فعالیت‌های سیستم به محض وقوع اینجا نمایش داده می‌شوند.
            </p>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
