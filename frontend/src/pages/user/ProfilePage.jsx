import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import {
  User,
  Camera,
  Lock,
  Save,
  Loader2,
  Bell,
  Moon,
  Globe,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/store/themeStore";
import useUserStore from "@/store/userStore";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const profileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  email: z.string().email("آدرس ایمیل نامعتبر است"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی ضروری است"),
    newPassword: z.string().min(8, "رمز عبور باید حداقل ۸ حرف باشد"),
    confirmPassword: z.string().min(1, "لطفاً رمز عبور خود را تایید کنید"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور مطابقت ندارد",
    path: ["confirmPassword"],
  });

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const { theme, toggleTheme } = useThemeStore();
  const { user, updateMe, getMe, loading: storeLoading } = useUserStore();
  const { updatePassword } = useAuthStore();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await getMe();
      } catch (error) {
        toast.error("بارگذاری اطلاعات کاربر ناموفق بود");
        console.error(error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [getMe, user]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Only send allowed fields (name, email, avatar)
      const updateData = {
        name: data.name,
        email: data.email,
      };

      await updateMe(updateData);
      toast.success("پروفایل موفقانه به‌روز شد");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "به‌روزرسانی پروفایل ناموفق بود",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        passwordConfirm: data.confirmPassword,
      });
      toast.success("رمز عبور موفقانه تغییر کرد");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "تغییر رمز عبور ناموفق بود");
      console.error(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("avatar", file);

      // Upload avatar
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/updateMe`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Update user in store
      if (response.data.data.user) {
        useUserStore.getState().setUser(response.data.data.user);
      }

      toast.success("عکس پروفایل موفقانه به‌روز شد");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "آپلود عکس پروفایل ناموفق بود",
      );
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2 text-right">
          تنظیمات پروفایل
        </h1>
        <p className="text-muted-foreground text-right">
          تنظیمات و ترجیحات حساب کاربری خود را مدیریت کنید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4 group">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.name || "کاربر")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </div>
              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.email}
              </p>
              <Badge variant="outline" className="px-3 py-1">
                {user?.role === "admin" ? "مدیر سیستم" : "عضو"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="preferences">
                <Bell className="w-4 h-4 ml-2" />
                ترجیحات
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 ml-2" />
                امنیت
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="w-4 h-4 ml-2" />
                پروفایل
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">اطلاعات شخصی</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleProfileSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-right block">
                        نام کامل
                      </Label>
                      <Input
                        id="name"
                        {...registerProfile("name")}
                        disabled={storeLoading}
                        className="text-right"
                      />
                      {profileErrors.name && (
                        <p className="text-sm text-destructive text-right">
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-right block">
                        آدرس ایمیل
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerProfile("email")}
                        disabled={storeLoading}
                        className="text-right"
                        dir="ltr"
                      />
                      {profileErrors.email && (
                        <p className="text-sm text-destructive text-right">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-right block">
                        شماره تلفن (اختیاری)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...registerProfile("phone")}
                        disabled={storeLoading}
                        placeholder="در حال حاضر قابل به‌روزرسانی نیست"
                        className="text-right"
                        dir="ltr"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        به‌روزرسانی شماره تلفن در این نسخه موجود نیست
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-start">
                      <Button
                        type="submit"
                        disabled={isLoading || storeLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="ml-2 h-4 w-4" />
                            ذخیره تغییرات
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تغییر رمز عبور</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-right block"
                      >
                        رمز عبور فعلی
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword("currentPassword")}
                        disabled={isPasswordLoading}
                        className="text-right"
                        dir="ltr"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive text-right">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-right block">
                        رمز عبور جدید
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword("newPassword")}
                        disabled={isPasswordLoading}
                        className="text-right"
                        dir="ltr"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive text-right">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-right block"
                      >
                        تایید رمز عبور جدید
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword("confirmPassword")}
                        disabled={isPasswordLoading}
                        className="text-right"
                        dir="ltr"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive text-right">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-start">
                      <Button type="submit" disabled={isPasswordLoading}>
                        {isPasswordLoading ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            در حال به‌روزرسانی...
                          </>
                        ) : (
                          "به‌روزرسانی رمز عبور"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-right">
                    تایید هویت دو مرحله‌ای
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">فعال‌سازی تایید دو مرحله‌ای</p>
                      <p className="text-sm text-muted-foreground">
                        یک لایه امنیتی اضافی به حساب خود اضافه کنید
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch disabled />
                      <span className="text-xs text-muted-foreground mr-2">
                        به زودی
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تنظیمات اعلان‌ها</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">اعلان‌های ایمیلی</p>
                      <p className="text-sm text-muted-foreground">
                        دریافت تاییدیه‌های رزرو و به‌روزرسانی‌ها
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">اعلان‌های پیامکی</p>
                      <p className="text-sm text-muted-foreground">
                        دریافت پیامک برای به‌روزرسانی‌های فوری
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">ایمیل‌های بازاریابی</p>
                      <p className="text-sm text-muted-foreground">
                        دریافت پیشنهادات و تخفیف‌ها
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-right">تنظیمات نمایش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <div className="text-right">
                        <p className="font-medium">حالت تاریک</p>
                        <p className="text-sm text-muted-foreground">
                          تغییر بین تم روشن و تاریک
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <div className="text-right">
                        <p className="font-medium">زبان</p>
                        <p className="text-sm text-muted-foreground">
                          زبان مورد نظر خود را انتخاب کنید
                        </p>
                      </div>
                    </div>
                    <Select defaultValue="fa">
                      <SelectTrigger className="w-30 text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en" className="text-right">
                          English
                        </SelectItem>
                        <SelectItem value="fa" className="text-right">
                          فارسی (دری)
                        </SelectItem>
                        <SelectItem value="ps" className="text-right">
                          پشتو
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
