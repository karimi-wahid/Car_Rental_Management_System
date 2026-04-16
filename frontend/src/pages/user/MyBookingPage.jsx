import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Filter, Search, X, Calendar, Car, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { BookingCard } from "@/components/user/BookingCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import useAuthStore from "@/store/authStore";
// import { bookingService } from "@/services/booking.service";
import { toast } from "react-hot-toast";

const MyBookingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy:
          sortBy === "newest"
            ? "createdAt"
            : sortBy === "oldest"
              ? "createdAt"
              : "startDate",
        sortOrder:
          sortBy === "newest" ? "desc" : sortBy === "oldest" ? "asc" : "asc",
      };

      if (activeTab !== "all") {
        params.status = activeTab;
      }

      const response = await bookingService.getUserBookings(params);
      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("خطا در دریافت رزروها");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortBy, activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId, "لغو توسط کاربر");
      toast.success("رزرو با موفقیت لغو شد");
      fetchBookings();
    } catch (error) {
      toast.error("خطا در لغو رزرو");
      console.log(error);
    }
  };

  const handleModifyBooking = (bookingId) => {
    // Navigate to modify booking page
    window.location.href = `/bookings/${bookingId}/modify`;
  };

  const handleViewDetails = (bookingId) => {
    window.location.href = `/bookings/${bookingId}`;
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.car?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.car?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = [
    { value: "all", label: "همه رزروها" },
    { value: "pending", label: "در انتظار" },
    { value: "confirmed", label: "تایید شده" },
    { value: "active", label: "فعال" },
    { value: "completed", label: "تکمیل شده" },
    { value: "cancelled", label: "لغو شده" },
  ];

  const getStatusCount = (status) => {
    if (status === "all") return bookings.length;
    return bookings.filter((b) => b.status === status).length;
  };

  const getEmptyStateMessage = () => {
    if (searchQuery) {
      return {
        title: "نتیجه‌ای یافت نشد",
        description: `هیچ نتیجه‌ای برای "${searchQuery}" یافت نشد`,
      };
    }

    if (activeTab !== "all") {
      const tabLabel = tabs.find((t) => t.value === activeTab)?.label;
      return {
        title: `${tabLabel} یافت نشد`,
        description: `شما هیچ رزرو ${tabLabel} ندارید`,
      };
    }

    return {
      title: "هیچ رزروی یافت نشد",
      description:
        "شما هنوز هیچ رزروی انجام نداده‌اید. موتر رویایی خود را انتخاب و رزرو کنید!",
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <PageHeader
        title="رزروهای من"
        description={`${user?.name || "کاربر"} عزیز، رزروهای خود را مشاهده و مدیریت کنید`}
      />

      {/* Quick Stats */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">کل رزروها</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
            <p className="text-sm text-muted-foreground mb-1">فعال</p>
            <p className="text-2xl font-bold text-green-600">
              {
                bookings.filter((b) =>
                  ["confirmed", "active"].includes(b.status),
                ).length
              }
            </p>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/10">
            <p className="text-sm text-muted-foreground mb-1">تکمیل شده</p>
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/10">
            <p className="text-sm text-muted-foreground mb-1">در انتظار</p>
            <p className="text-2xl font-bold text-orange-600">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full lg:w-auto"
        >
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full lg:w-auto gap-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative"
              >
                {tab.label}
                {getStatusCount(tab.value) > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    {getStatusCount(tab.value)}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="جستجوی موتر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 w-full lg:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="upcoming">نزدیک‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-xl">
              <div className="p-4 space-y-3">
                <div className="h-48 bg-muted-foreground/10 rounded-lg" />
                <div className="h-4 bg-muted-foreground/10 rounded w-3/4" />
                <div className="h-4 bg-muted-foreground/10 rounded w-1/2" />
                <div className="h-10 bg-muted-foreground/10 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
                onModify={handleModifyBooking}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={searchQuery ? Search : Calendar}
          title={emptyState.title}
          description={emptyState.description}
          action={
            !searchQuery && activeTab === "all"
              ? {
                  label: "مشاهده موترها",
                  onClick: () => (window.location.href = "/cars"),
                }
              : undefined
          }
          secondaryAction={
            searchQuery
              ? {
                  label: "پاک کردن فیلترها",
                  onClick: () => {
                    setSearchQuery("");
                    setActiveTab("all");
                  },
                }
              : undefined
          }
        />
      )}
    </motion.div>
  );
};

export default MyBookingsPage;
