import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    requiredRoles = [],
    userRole = "",
    redirectPath = "/",
  } = location.state || {};

  const getRoleDisplay = (role) => {
    const roles = {
      admin: "ادمین",
      user: "کاربر",
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-display font-bold mb-4">
            دسترسی غیرمجاز
          </h1>

          <p className="text-muted-foreground mb-6">
            شما دسترسی لازم برای مشاهده این صفحه را ندارید.
          </p>

          {requiredRoles.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm mb-2">
                نقش شما:{" "}
                <span className="font-medium">{getRoleDisplay(userRole)}</span>
              </p>
              <p className="text-sm">
                نقش‌های مجاز:{" "}
                <span className="font-medium">
                  {requiredRoles.map(getRoleDisplay).join("، ")}
                </span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(redirectPath)} className="w-full">
              <Home className="ml-2 h-4 w-4" />
              رفتن به داشبورد
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              برگشت به صفحه قبلی
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
