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
  Eye,
  EyeOff,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getInitials, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useThemeStore } from "@/store/themeStore";
import useUserStore from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                                  ZOD SCHEMA                                */
/* -------------------------------------------------------------------------- */

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ حرف باشد"),

  email: z.email("ایمیل نامعتبر است"),

  phone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;

      return /^(\+93|0)?7\d{8}$/.test(value);
    }, "شماره تماس نامعتبر است"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),

    newPassword: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .regex(/[a-z]/, "رمز عبور باید شامل حروف کوچک باشد")
      .regex(/[A-Z]/, "رمز عبور باید شامل حروف بزرگ باشد")
      .regex(/[0-9]/, "رمز عبور باید شامل عدد باشد")
      .regex(/[@$!%*?&#]/, "رمز عبور باید شامل کاراکتر خاص باشد"),

    confirmPassword: z.string().min(1, "تایید رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

/* -------------------------------------------------------------------------- */
/*                              PASSWORD STRENGTH                             */
/* -------------------------------------------------------------------------- */

const calculatePasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[@$!%*?&#]/.test(password)) strength += 20;

  return strength;
};

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme, toggleTheme } = useThemeStore();

  const { user, updateMe, getMe, loading: storeLoading } = useUserStore();

  const { updatePassword } = useAuthStore();

  const navigate = useNavigate();
  const { deleteMe } = useUserStore();
  const logout = useAuthStore((state) => state.logout);
  const [deletingAccount, setDeletingAccount] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                               PROFILE FORM                                 */
  /* -------------------------------------------------------------------------- */

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                              PASSWORD FORM                                 */
  /* -------------------------------------------------------------------------- */

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword", "");

  const passwordStrength = calculatePasswordStrength(newPassword);

  const getStrengthText = (strength) => {
    if (strength < 50) return "ضعیف";
    if (strength < 75) return "متوسط";
    return "قوی";
  };

  /* -------------------------------------------------------------------------- */
  /*                                  EFFECTS                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getMe();
      } catch (error) {
        toast.error("بارگذاری اطلاعات ناموفق بود");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [getMe, user]);

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, resetProfile]);

  /* -------------------------------------------------------------------------- */
  /*                               PROFILE SUBMIT                               */
  /* -------------------------------------------------------------------------- */

  const onProfileSubmit = async (data) => {
    setIsLoading(true);

    try {
      await updateMe({
        name: data.name,
        email: data.email,
      });

      toast.success("پروفایل موفقانه به‌روز شد");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "به‌روزرسانی پروفایل ناموفق بود",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              PASSWORD SUBMIT                               */
  /* -------------------------------------------------------------------------- */

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);

    try {
      await updatePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword,
      );

      toast.success("رمز عبور موفقانه تغییر کرد");

      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "تغییر رمز عبور ناموفق بود");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               AVATAR UPLOAD                                */
  /* -------------------------------------------------------------------------- */

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingAvatar(true);

    try {
      const formData = new FormData();

      formData.append("avatar", file);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/update-avatar`,
        formData,
        {
          withCredentials: true,

          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("عکس پروفایل به‌روز شد");
    } catch (error) {
      toast.error(error.response?.data?.message || "آپلود عکس ناموفق بود");
      console.log(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Delete Account                                */
  /* -------------------------------------------------------------------------- */

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await deleteMe();
      await logout();
      toast.success("حساب کاربری حذف شد");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "حذف حساب ناموفق بود");
    } finally {
      setDeletingAccount(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Language Change                                */
  /* -------------------------------------------------------------------------- */

  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    localStorage.setItem("lang", lang);

    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";

    document.documentElement.lang = lang;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} dir="rtl">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-right">تنظیمات پروفایل</h1>

        <p className="text-muted-foreground text-right">
          حساب کاربری و تنظیمات خود را مدیریت کنید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR */}

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
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                />
              </div>

              <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>

              <p className="text-sm text-muted-foreground mb-4">
                {user?.email}
              </p>

              <Badge variant="outline">
                {user?.role === "admin" ? "مدیر سیستم" : "عضو"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CONTENT */}

        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" dir="rtl">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 ml-2" />
                پروفایل
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 ml-2" />
                امنیت
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Bell className="w-4 h-4 ml-2" />
                ترجیحات
              </TabsTrigger>
            </TabsList>

            {/* PROFILE */}

            <TabsContent value="profile" dir="rtl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">اطلاعات شخصی</CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    dir="rtl"
                    onSubmit={handleProfileSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">نام کامل</Label>

                      <Input
                        id="name"
                        {...registerProfile("name")}
                        disabled={storeLoading}
                      />

                      {profileErrors.name && (
                        <p className="text-sm text-destructive">
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">ایمیل</Label>

                      <Input
                        id="email"
                        type="email"
                        {...registerProfile("email")}
                        disabled={storeLoading}
                      />

                      {profileErrors.email && (
                        <p className="text-sm text-destructive">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">شماره تماس</Label>

                      <Input
                        id="phone"
                        placeholder="+93 700 000 000"
                        {...registerProfile("phone")}
                        disabled={storeLoading}
                      />

                      {profileErrors.phone && (
                        <p className="text-sm text-destructive">
                          {profileErrors.phone.message}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <Button type="submit" disabled={isLoading || storeLoading}>
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
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SECURITY */}

            <TabsContent value="security" dir="rtl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تغییر رمز عبور</CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    {/* CURRENT PASSWORD */}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">رمز عبور فعلی</Label>

                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          {...registerPassword("currentPassword")}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    {/* NEW PASSWORD */}

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">رمز عبور جدید</Label>

                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          {...registerPassword("newPassword")}
                        />

                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}

                      {/* PASSWORD STRENGTH */}

                      {newPassword && (
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between text-sm">
                            <span>قدرت رمز عبور</span>

                            <span
                              className={cn(
                                passwordStrength < 50 && "text-destructive",

                                passwordStrength >= 50 &&
                                  passwordStrength < 75 &&
                                  "text-yellow-500",

                                passwordStrength >= 75 && "text-green-500",
                              )}
                            >
                              {getStrengthText(passwordStrength)}
                            </span>
                          </div>

                          <Progress value={passwordStrength} />
                        </div>
                      )}
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تایید رمز عبور</Label>

                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...registerPassword("confirmPassword")}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Separator />

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
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PREFERENCES */}

            <TabsContent value="preferences" dir="rtl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تنظیمات نمایش</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">حالت تاریک</p>

                      <p className="text-sm text-muted-foreground">
                        تغییر بین تم روشن و تاریک
                      </p>
                    </div>

                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium">زبان</p>

                      <p className="text-sm text-muted-foreground">
                        زبان سیستم را انتخاب کنید
                      </p>
                    </div>

                    <Select
                      defaultValue="fa"
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="fa">فارسی</SelectItem>

                        <SelectItem value="ps">پشتو</SelectItem>

                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-medium text-destructive">
                        حذف حساب کاربری
                      </p>
                      <p className="text-sm text-muted-foreground">
                        این عمل غیرقابل بازگشت است. تمام داده‌های شما حذف خواهد
                        شد.
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors shrink-0"
                          disabled={deletingAccount}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف حساب
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-right text-destructive">
                            آیا از حذف حساب اطمینان دارید؟
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-right space-y-2">
                            <span className="block">
                              این عمل قابل بازگشت نیست. با حذف حساب:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-right text-sm">
                              <li>تمام اطلاعات شخصی شما پاک می‌شود</li>
                              <li>تاریخچه رزروها حذف می‌شود</li>
                              <li>دسترسی به حساب برای همیشه از بین می‌رود</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row-reverse gap-2">
                          <AlertDialogCancel>انصراف</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                          >
                            {deletingAccount ? (
                              <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                در حال حذف...
                              </>
                            ) : (
                              "بله، حساب را حذف کن"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
