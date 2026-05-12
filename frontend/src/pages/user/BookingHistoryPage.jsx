import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Car, Download, Eye, Filter, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import useBookingStore from "@/store/bookingStore";
import { useNavigate } from "react-router-dom";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { fetchUserBookings, loading, error } = useBookingStore(
    (state) => state,
  );

  // Update the useEffect in BookingHistoryPage
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        };

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        const response = await fetchUserBookings(params);
        setBookings(response?.data?.currentBookings || []);

        if (response?.pagination) {
          setPagination({
            page: response.pagination.currentPage || 1,
            limit: response.pagination.itemsPerPage || 10,
            total: response.pagination.totalItems || 0,
            pages: response.pagination.totalPages || 0,
          });
        } else {
          setPagination({
            page: 1,
            limit: 10,
            total: response?.data?.bookings?.length || 0,
            pages: 1,
          });
        }
      } catch (err) {
        toast.error("بارگذاری تاریخچه رزرو ناموفق بود");
        toast.error(error);
        console.log(error);

        setBookings([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        });
      }
    };

    fetchBookingHistory();
  }, [pagination.page, statusFilter, pagination.limit, fetchUserBookings]);

  const handleExport = () => {
    // Generate CSV
    toast.success("تاریخچه رزرو صادر شد");
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.car.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      case "completed":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="تاریخچه رزروها"
        description="مشاهده تمام رزروهای قبلی و فعلی شما"
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 ml-2" />
            صادر کردن
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام یا برند موتر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right"
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-37.5">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-right">
                  همه وضعیت‌ها
                </SelectItem>
                <SelectItem value="confirmed" className="text-right">
                  تایید شده
                </SelectItem>
                <SelectItem value="pending" className="text-right">
                  در انتظار
                </SelectItem>
                <SelectItem value="completed" className="text-right">
                  تکمیل شده
                </SelectItem>
                <SelectItem value="cancelled" className="text-right">
                  لغو شده
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                در حال بارگذاری تاریخچه رزرو...
              </p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">موتر</TableHead>
                    <TableHead className="text-right">تاریخ‌ها</TableHead>
                    <TableHead className="text-right">مدت</TableHead>
                    <TableHead className="text-right">مجموع</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const start = new Date(booking.startDate);
                    const end = new Date(booking.endDate);
                    const days = Math.ceil(
                      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
                    );

                    return (
                      <TableRow key={booking._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img
                                src={booking.car.images[0].url}
                                alt={booking.car.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-right">
                                {booking.car.name}
                              </p>
                              <p className="text-sm text-muted-foreground text-right">
                                {booking.car.brand} {booking.car.carModel}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-right">
                            {formatDate(start)}
                          </p>
                          <p className="text-sm text-muted-foreground text-right">
                            تا {formatDate(end)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{days} روز</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-right">
                          {formatCurrency(booking.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/bookings/${booking._id}`)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="p-4 border-t">
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
            <div className="p-12 text-center">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">هیچ رزروی یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? `نتیجه‌ای برای "${searchQuery}" یافت نشد`
                  : "شما هنوز هیچ رزروی انجام نداده‌اید."}
              </p>
              <Button onClick={() => navigate("/cars")}>مشاهده موترها</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingHistoryPage;
