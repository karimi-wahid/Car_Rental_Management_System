import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import useFavoriteStore from "@/store/favoriteStore";

const FavoriteButton = ({ carId, classCode }) => {
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);
  const loading = useFavoriteStore((s) => s.loading);
  const isFavoriteFn = useFavoriteStore((s) => s.isFavorite);

  const favorited = isFavoriteFn(carId);

  const handleToggle = async () => {
    try {
      await toggleFavorite(carId, favorited);
      // ✅ Use favorited (captured before toggle) for correct message
      toast.success(
        favorited ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
      );
    } catch (error) {
      toast.error("خطایی رخ داد");
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`${classCode} ${favorited ? "text-red-500" : ""}`}
      disabled={loading}
    >
      <Heart className="w-4 h-4" fill={favorited ? "currentColor" : "none"} />
    </Button>
  );
};

export default FavoriteButton;
