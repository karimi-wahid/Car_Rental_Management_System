import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  UserCog,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { formatDate, getInitials } from "@/lib/utils";
import { toast } from "react-hot-toast";

import useUserStore from "@/store/userStore";

const ManageUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const { users, loading, pagination, getAllUsers, updateUserRole } =
    useUserStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // ✅ Role change
  const handleRoleChange = async () => {
    if (!selectedUser) return;

    const newRole = selectedUser.role === "user" ? "admin" : "user";

    // ✅ Prevent unnecessary request
    if (selectedUser.role === newRole) return;

    try {
      const res = await updateUserRole(selectedUser._id, newRole);

      // ✅ Get updated user from response
      const updatedUser = res.data.user || res.data.data?.user;

      // ✅ Update selectedUser locally (VERY IMPORTANT)
      setSelectedUser(updatedUser);

      toast.success(
        `نقش کاربر به ${newRole === "admin" ? "مدیر" : "کاربر"} تغییر کرد`,
      );

      setIsRoleDialogOpen(false);
    } catch (error) {
      toast.error("تغییر نقش کاربر ناموفق بود");
      console.log(error);
    }
  };

  // ✅ Client search, role, and verification filter
  console.log(users);
  const filteredUsers = users
    .filter(
      (u) =>
        (u?.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u?.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
    .filter((u) => {
      if (verificationFilter === "all") return true;
      if (verificationFilter === "verified") return u.isEmailVerified;
      if (verificationFilter === "unverified") return !u.isEmailVerified;
      return true;
    });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} dir="rtl">
      <PageHeader title="مدیریت کاربران" description="مدیریت حساب‌های کاربری" />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 text-right"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-37.5">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="نقش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">
                همه
              </SelectItem>
              <SelectItem value="user" className="text-right">
                کاربر
              </SelectItem>
              <SelectItem value="admin" className="text-right">
                مدیر
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={verificationFilter}
            onValueChange={setVerificationFilter}
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="وضعیت تایید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">
                همه
              </SelectItem>
              <SelectItem value="verified" className="text-right">
                تایید شده
              </SelectItem>
              <SelectItem value="unverified" className="text-right">
                تایید نشده
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          {loading ? (
            <p className="text-center py-10">در حال بارگذاری...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-10">هیچ کاربری یافت نشد</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">کاربر</TableHead>
                    <TableHead className="text-right">نقش</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">تاریخ عضویت</TableHead>
                    <TableHead className="text-left"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex gap-3 items-center">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-right">{user.name}</p>
                            <p
                              className="text-sm text-muted-foreground text-right"
                              dir="ltr"
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge>
                          {user.role === "admin" ? "مدیر" : "کاربر"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.isEmailVerified ? (
                            <>
                              <CheckCircle className="text-green-500 w-4 h-4" />
                              <span className="text-sm">تایید شده</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="text-yellow-500 w-4 h-4" />
                              <span className="text-sm">تایید نشده</span>
                            </>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel className="text-right">
                              عملیات
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsRoleDialogOpen(true);
                              }}
                              className="flex-row-reverse"
                            >
                              <UserCog className="ml-2 w-4 h-4" />
                              تغییر نقش
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsVerificationDialogOpen(true);
                              }}
                              className="flex-row-reverse"
                            >
                              <Shield className="ml-2 w-4 h-4" />
                              تغییر وضعیت تایید
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="text-red-500 flex-row-reverse">
                              <Ban className="ml-2 w-4 h-4" />
                              تعلیق
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page || 1}
                totalPages={pagination.pages || 1}
                onPageChange={(page) => getAllUsers({ page })}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">تغییر نقش کاربر</DialogTitle>
            <DialogDescription className="text-right">
              آیا مطمئن هستید که می‌خواهید نقش این کاربر را تغییر دهید؟
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-right">
              کاربر: <span className="font-medium">{selectedUser?.name}</span>
            </p>
            <p className="text-right text-muted-foreground" dir="ltr">
              {selectedUser?.email}
            </p>
            <p className="text-right mt-2">
              نقش فعلی:{" "}
              <Badge>{selectedUser?.role === "admin" ? "مدیر" : "کاربر"}</Badge>
            </p>
            <p className="text-right mt-2">
              نقش جدید:{" "}
              <Badge variant="outline">
                {selectedUser?.role === "user" ? "مدیر" : "کاربر"}
              </Badge>
            </p>
          </div>

          <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
            >
              لغو
            </Button>
            <Button onClick={handleRoleChange} className="mr-2 sm:mr-0 sm:ml-2">
              تایید
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ManageUsersPage;
