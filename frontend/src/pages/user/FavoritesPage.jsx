import React, { useEffect } from "react";
import { CarCard } from "@/components/cars/CarCard";
import useFavoriteStore from "@/store/favoriteStore";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/common/PageHeader";

const FavoritesPage = () => {
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoriteStore((s) => s.favorites);
  const loading = useFavoriteStore((s) => s.loading);
  const error = useFavoriteStore((s) => s.error);
  const getFavorites = useFavoriteStore((s) => s.getFavorites);
  const clearError = useFavoriteStore((s) => s.clearError);

  useEffect(() => {
    getFavorites();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <div className="text-gray-500">در حال بارگذاری علاقه‌مندی‌ها...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <PageHeader
        title="موترهای مورد علاقه من"
        description={`${user?.name || "کاربر"} عزیز، موترهای مورد علاقه خود را مشاهده و مدیریت کنید`}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-600">خطا: {error}</p>
          <button onClick={clearError} className="mt-2 text-sm text-red-700">
            رد کردن
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            هنوز موتری به علاقه‌مندی‌ها اضافه نشده است.
          </p>
          <p className="text-gray-400 mt-2">
            شروع به اضافه کردن موترها به علاقه‌مندی‌های خود کنید!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
