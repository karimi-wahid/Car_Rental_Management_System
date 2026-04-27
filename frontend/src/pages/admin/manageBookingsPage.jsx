import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, Eye, Calendar } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { toast } from "react-hot-toast";
import useBookingStore from "@/store/bookingStore";

const ManageBookingsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const {
    bookings,
    loading,
    pagination,
    fetchAllBookings,
    updateBookingStatus,
  } = useBookingStore();

  const {
    currentPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
  } = pagination || {};

  useEffect(() => {
    fetchAllBookings(currentPage, itemsPerPage);
  }, [fetchAllBookings, currentPage, itemsPerPage]);

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await updateBookingStatus(selectedBooking._id, newStatus, statusNote);

      toast.success(`وضعیت رزرو به ${getStatusText(newStatus)} تغییر کرد`);
      console.log(bookings);

      setIsStatusDialogOpen(false);
      setStatusNote("");
      setNewStatus("");
    } catch (error) {
      toast.error("به‌روزرسانی وضعیت رزرو ناموفق بود");
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
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
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const carMatch = booking.car?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const userMatch =
      booking.user &&
      typeof booking.user !== "string" &&
      booking.user.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return carMatch || userMatch;
  });

  const statusOptions = [
    { value: "pending", label: "در انتظار" },
    { value: "confirmed", label: "تایید شده" },
    { value: "cancelled", label: "لغو شده" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      <PageHeader
        title="مدیریت رزروها"
        description="مشاهده و مدیریت تمام رزروها"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام موتر یا مشتری..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-45">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-right">
                  همه رزروها
                </SelectItem>
                <SelectItem value="pending" className="text-right">
                  در انتظار
                </SelectItem>
                <SelectItem value="confirmed" className="text-right">
                  تایید شده
                </SelectItem>
                <SelectItem value="cancelled" className="text-right">
                  لغو شده
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">در حال بارگذاری رزروها...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">مشتری</TableHead>
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
                    const user =
                      typeof booking.user !== "string" ? booking.user : null;

                    return (
                      <TableRow key={booking._id}>
                        <TableCell>
                          {user && (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-right">
                                  {user.name}
                                </p>
                                <p
                                  className="text-xs text-muted-foreground text-right"
                                  dir="ltr"
                                >
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                              <img
                                src={
                                  booking.car.images?.[0]?.url ||
                                  "/placeholder-car.jpg"
                                }
                                alt={booking.car.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-right">
                                {booking.car.name}
                              </p>
                              <p className="text-xs text-muted-foreground text-right">
                                {booking.car.licensePlate}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3 h-3 ml-1" />
                              <span>
                                {formatDate(start)} - {formatDate(end)}
                              </span>
                            </div>
                          </div>
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
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                window.open(`/bookings/${booking._id}`)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select
                              value=""
                              onValueChange={(value) => {
                                setSelectedBooking(booking);
                                setNewStatus(value);
                                setIsStatusDialogOpen(true);
                              }}
                            >
                              <SelectTrigger className="w-25">
                                <SelectValue placeholder="به‌روزرسانی" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-right"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) =>
                      fetchAllBookings(page, itemsPerPage)
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">هیچ رزروی یافت نشد</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `نتیجه‌ای برای "${searchQuery}" یافت نشد`
                  : "هیچ رزروی با فیلترهای انتخاب شده مطابقت ندارد."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">
              به‌روزرسانی وضعیت رزرو
            </DialogTitle>
            <DialogDescription className="text-right">
              وضعیت این رزرو را تغییر دهید و یادداشت اضافه کنید.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-right block">وضعیت جدید</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value)}
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="انتخاب وضعیت جدید" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-right"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note" className="text-right block">
                یادداشت (اختیاری)
              </Label>
              <Textarea
                id="note"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="هرگونه یادداشت درباره این تغییر وضعیت را وارد کنید..."
                className="text-right"
              />
            </div>
          </div>
          <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              لغو
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!newStatus}
              className="mr-2 sm:mr-0 sm:ml-2"
            >
              به‌روزرسانی وضعیت
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ManageBookingsPage;
