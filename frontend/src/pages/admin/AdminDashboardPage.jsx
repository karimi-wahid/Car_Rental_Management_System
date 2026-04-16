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
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("fa-IR").format(value);
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [stats, setStats] = useState({
    overview: {
      totalUsers: 1250,
      totalCars: 48,
      totalBookings: 342,
      totalRevenue: 285000000,
      availableCars: 32,
      occupancyRate: 68,
      avgBookingValue: 833000,
      conversionRate: 12.5,
      newUsersToday: 24,
      pendingBookings: 18,
    },
    revenueData: [
      { month: "فروردین", revenue: 45000000 },
      { month: "اردیبهشت", revenue: 52000000 },
      { month: "خرداد", revenue: 48000000 },
      { month: "تیر", revenue: 61000000 },
      { month: "مرداد", revenue: 58000000 },
      { month: "شهریور", revenue: 71000000 },
    ],
    bookingsByStatus: {
      pending: { count: 18, revenue: 15000000 },
      confirmed: { count: 145, revenue: 120000000 },
      completed: { count: 156, revenue: 130000000 },
      cancelled: { count: 23, revenue: 20000000 },
    },
    popularCars: [
      {
        carDetails: {
          name: "تسلا مدل ۳",
          brand: "تسلا",
          model: "۲۰۲۴",
          images: ["/cars/tesla-model3.jpg"],
        },
        bookings: 45,
        revenue: 37500000,
        rating: 4.8,
      },
      {
        carDetails: {
          name: "بی ام و X5",
          brand: "بی ام و",
          model: "۲۰۲۴",
          images: ["/cars/bmw-x5.jpg"],
        },
        bookings: 38,
        revenue: 42000000,
        rating: 4.9,
      },
      {
        carDetails: {
          name: "مرسدس بنز E-Class",
          brand: "مرسدس بنز",
          model: "۲۰۲۴",
          images: ["/cars/mercedes-eclass.jpg"],
        },
        bookings: 32,
        revenue: 38000000,
        rating: 4.7,
      },
    ],
    recentActivities: [
      {
        type: "user_created",
        description: "کاربر جدید ثبت نام کرد: علی محمدی",
        timestamp: new Date(),
        amount: null,
      },
      {
        type: "booking_created",
        description: "رزرو جدید: تسلا مدل ۳ توسط سارا احمدی",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        amount: 2500000,
      },
      {
        type: "payment_received",
        description: "پرداخت دریافت شد: رزرو #۱۲۳۴۵",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        amount: 3500000,
      },
      {
        type: "car_added",
        description: "موتر جدید اضافه شد: پورشه کاین",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        amount: null,
      },
      {
        type: "booking_completed",
        description: "رزرو تکمیل شد: بی ام و X5",
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        amount: 2800000,
      },
    ],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch real data here
        // const response = await adminService.getDashboardStats({ timeRange });
        // setStats(response.data);

        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات داشبورد");
        console.error(error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const statCards = [
    {
      title: "کل کاربران",
      value: formatNumber(stats.overview.totalUsers),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      trend: "+۱۲٪",
      trendUp: true,
      subtitle: `${stats.overview.newUsersToday} کاربر جدید امروز`,
    },
    {
      title: "کل موترها",
      value: stats.overview.totalCars,
      icon: Car,
      color: "from-purple-500 to-pink-500",
      trend: "+۵٪",
      trendUp: true,
      subtitle: `${stats.overview.availableCars} موتر در دسترس`,
    },
    {
      title: "کل رزروها",
      value: stats.overview.totalBookings,
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      trend: "+۱۸٪",
      trendUp: true,
      subtitle: `${stats.overview.pendingBookings} در انتظار تایید`,
    },
    {
      title: "درآمد کل",
      value: formatCurrency(stats.overview.totalRevenue),
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      trend: "+۲۳٪",
      trendUp: true,
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
        <div className="flex gap-2">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
          >
            هفته
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
          >
            ماه
          </Button>
          <Button
            variant={timeRange === "year" ? "default" : "outline"}
            onClick={() => setTimeRange("year")}
          >
            سال
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نرخ اشغال</p>
                <p className="text-2xl font-bold">
                  {stats.overview.occupancyRate}٪
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <Progress value={stats.overview.occupancyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نرخ تبدیل</p>
                <p className="text-2xl font-bold">
                  {stats.overview.conversionRate}٪
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <Progress value={stats.overview.conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">میانگین امتیاز</p>
                <p className="text-2xl font-bold">۴.۸</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-500 text-yellow-500"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">رزروهای امروز</p>
                <p className="text-2xl font-bold">۱۲</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +۳ نسبت به دیروز
            </p>
          </CardContent>
        </Card>
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
                  <Badge
                    variant={stat.trendUp ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.popularCars.map((car, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden">
                    <img
                      src={car.carDetails.images[0]}
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
                      {car.carDetails.brand} {car.carDetails.model}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 ml-1" />
                        <span className="text-sm">{car.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm">{car.bookings} رزرو</span>
                    </div>
                    <Badge variant="outline" className="w-full justify-center">
                      {formatCurrency(car.revenue)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
