import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  FileText,
  Bell,
  Shield,
  CreditCard,
  TrendingUp,
  Star,
  Tag,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  {
    name: "داشبورد",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "مدیریت موترها",
    href: "/admin/cars",
    icon: Car,
    badge: null,
  },
  {
    name: "مدیریت کاربران",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "رزروها",
    href: "/admin/bookings",
    icon: Calendar,
    badge: { count: 5, variant: "destructive" },
  },
  {
    name: "تحلیل و آمار",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "گزارشات",
    href: "/admin/reports",
    icon: FileText,
    badge: null,
  },
  {
    name: "درآمد",
    href: "/admin/revenue",
    icon: TrendingUp,
    badge: { count: "+۱۲٪", variant: "success" },
  },
  {
    name: "پرداخت‌ها",
    href: "/admin/payments",
    icon: CreditCard,
    badge: null,
  },
  {
    name: "اعلان‌ها",
    href: "/admin/notifications",
    icon: Bell,
    badge: { count: 3, variant: "default" },
  },
  {
    name: "نظرات",
    href: "/admin/reviews",
    icon: MessageSquare,
    badge: { count: 8, variant: "secondary" },
  },
  {
    name: "تخفیف‌ها",
    href: "/admin/promotions",
    icon: Tag,
    badge: null,
  },
  {
    name: "امنیت",
    href: "/admin/security",
    icon: Shield,
    badge: null,
  },
  {
    name: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
    badge: null,
  },
];

const bottomNavigation = [
  {
    name: "راهنما",
    href: "/admin/help",
    icon: HelpCircle,
  },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine if sidebar should be collapsed
  const shouldCollapse = isMobile ? true : collapsed;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: shouldCollapse ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative bg-card border-l",
        "flex flex-col",
        "fixed lg:relative inset-y-1.5 lg:inset-y-1.5 right-0 z-40", // Fixed on mobile, relative on desktop
      )}
    >
      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* User Info */}
      <div className={cn("p-4 border-b", shouldCollapse && "p-2")}>
        <div
          className={cn(
            "flex items-center",
            shouldCollapse ? "justify-center" : "gap-3",
          )}
        >
          <Avatar className="h-10 w-10 ring-2 ring-destructive/20 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-destructive/10 text-destructive">
              {getInitials(user?.name || "ادمین")}
            </AvatarFallback>
          </Avatar>
          {!shouldCollapse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-semibold truncate">
                {user?.name || "ادمین سیستم"}
              </p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
                مدیر سیستم
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className={cn("p-4", shouldCollapse && "p-2")}>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg transition-all duration-200 relative",
                      "hover:bg-accent hover:text-accent-foreground group",
                      shouldCollapse ? "justify-center p-3" : "px-4 py-3",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground",
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      !shouldCollapse && "ml-3",
                    )}
                  />
                  {!shouldCollapse && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 text-right"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <Badge
                      variant={
                        item.badge.variant === "success"
                          ? "default"
                          : item.badge.variant
                      }
                      className={cn(
                        "text-xs",
                        shouldCollapse
                          ? "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                          : "ml-auto",
                        item.badge.variant === "success" &&
                          "bg-green-500 hover:bg-green-600",
                      )}
                    >
                      {item.badge.count}
                    </Badge>
                  )}

                  {/* Tooltip for collapsed/mobile state */}
                  {shouldCollapse && (
                    <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                      {item.badge && ` (${item.badge.count})`}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Separator */}
          {!shouldCollapse && <div className="my-4 border-t" />}

          {/* Bottom Navigation */}
          <ul className="space-y-1">
            {bottomNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground group",
                      shouldCollapse ? "justify-center p-3" : "px-4 py-3",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground",
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      !shouldCollapse && "ml-3",
                    )}
                  />
                  {!shouldCollapse && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {shouldCollapse && (
                    <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className={cn("p-4 border-t", shouldCollapse && "p-2")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start group relative",
            shouldCollapse ? "justify-center p-3" : "px-4",
          )}
          onClick={handleLogout}
        >
          <LogOut
            className={cn("w-5 h-5 shrink-0", !shouldCollapse && "ml-2")}
          />
          {!shouldCollapse && "خروج"}

          {shouldCollapse && (
            <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              خروج
            </div>
          )}
        </Button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
