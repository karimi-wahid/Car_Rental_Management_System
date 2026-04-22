import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Shield,
  Search,
  Command,
  Calendar,
  Car,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { cn, getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "رزرو جدید",
      message: "علی رضایی یک تسلا مدل ۳ رزرو کرد",
      time: "۵ دقیقه پیش",
      type: "booking",
      icon: Calendar,
      read: false,
    },
    {
      id: 2,
      title: "پرداخت دریافت شد",
      message: "۱۲,۵۰۰,۰۰۰ تومان از سارا محمدی",
      time: "۱ ساعت پیش",
      type: "payment",
      icon: DollarSign,
      read: false,
    },
    {
      id: 3,
      title: "کاربر جدید",
      message: "رضا کریمی عضو شد",
      time: "۲ ساعت پیش",
      type: "user",
      icon: Users,
      read: true,
    },
    {
      id: 4,
      title: "موتر جدید اضافه شد",
      message: "بی ام و X5 به ناوگان اضافه شد",
      time: "۳ ساعت پیش",
      type: "car",
      icon: Car,
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="hidden md:flex items-center gap-2"
          >
            <Shield className="h-5 w-5 text-destructive" />
            <span className="text-sm font-semibold text-destructive">
              پنل مدیریت
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {showSearch ? (
              <motion.form
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative"
              >
                <Input
                  type="search"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 pl-4"
                  autoFocus
                  onBlur={() => !searchQuery && setShowSearch(false)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0"
                  onClick={() => setShowSearch(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="relative"
              >
                <Search className="h-5 w-5" />
                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground absolute -bottom-1 -right-1">
                  <Command className="h-3 w-3" />K
                </kbd>
              </Button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>اعلان‌ها</span>
                <Badge variant="outline">{unreadCount} خوانده نشده</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-4 cursor-pointer transition-colors",
                        !notification.read && "bg-muted/50",
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          notification.type === "booking" && "bg-blue-500/10",
                          notification.type === "payment" && "bg-green-500/10",
                          notification.type === "user" && "bg-purple-500/10",
                          notification.type === "car" && "bg-orange-500/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            notification.type === "booking" && "text-blue-500",
                            notification.type === "payment" && "text-green-500",
                            notification.type === "user" && "text-purple-500",
                            notification.type === "car" && "text-orange-500",
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <Badge
                              variant="destructive"
                              className="h-2 w-2 p-0 rounded-full"
                            />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center cursor-pointer"
                onClick={() => navigate("/admin/notifications")}
              >
                مشاهده همه اعلان‌ها
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 px-2 gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-destructive/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-destructive/10 text-destructive">
                    {getInitials(user?.name || "ادمین")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <span className="text-sm font-medium block">
                    {user?.name || "ادمین"}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    مدیر سیستم
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-right">
                <div>
                  <p>{user?.name || "ادمین"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/admin/profile")}
                className="cursor-pointer"
              >
                <User className="ml-2 h-4 w-4" />
                <span>پروفایل</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/settings")}
                className="cursor-pointer"
              >
                <Settings className="ml-2 h-4 w-4" />
                <span>تنظیمات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
              >
                <LogOut className="ml-2 h-4 w-4" />
                <span>خروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Keyboard shortcut handler */}
      {typeof window !== "undefined" && (
        <div className="hidden">
          {/* Add keyboard shortcut for search (Ctrl/Cmd + K) */}
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
