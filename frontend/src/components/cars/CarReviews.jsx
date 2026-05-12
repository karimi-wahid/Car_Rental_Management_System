import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import useFeedbackStore from "@/store/feedbackStore";
import { cn } from "@/lib/utils";

// ── Star Rating Input ──────────────────────────────────────
const StarInput = ({ value, onChange, size = 6 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              `w-${size} h-${size} transition-colors`,
              (hovered || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-zinc-300 dark:text-zinc-600",
            )}
          />
        </button>
      ))}
    </div>
  );
};

// ── Star Display ───────────────────────────────────────────
const StarDisplay = ({ value, size = 4 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          `w-${size} h-${size}`,
          value >= star
            ? "fill-amber-400 text-amber-400"
            : "text-zinc-200 dark:text-zinc-700",
        )}
      />
    ))}
  </div>
);

// ── Rating Breakdown Bar ───────────────────────────────────
const RatingBar = ({ label, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-6 text-xs text-zinc-400 shrink-0 text-right">
        {count}
      </span>
      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <span className="w-4 text-right text-zinc-500 dark:text-zinc-400 shrink-0">
        {label}
      </span>
    </div>
  );
};

// ── Submit / Edit Form ─────────────────────────────────────
const FeedbackForm = ({ carId, bookingId, existing, onClose }) => {
  const { createFeedback, updateFeedback, submitting } = useFeedbackStore();
  const [rating, setRating] = useState(existing?.rating || 0);
  const [title, setTitle] = useState(existing?.title || "");
  const [comment, setComment] = useState(existing?.comment || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("لطفاً امتیاز دهید");
    if (!comment.trim()) return toast.error("لطفاً نظر خود را بنویسید");

    const result = existing
      ? await updateFeedback(existing._id, { rating, title, comment })
      : await createFeedback({ carId, bookingId, rating, title, comment });

    if (result.success) {
      toast.success(existing ? "نظر ویرایش شد!" : "نظر ثبت شد!");
      onClose?.();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      onSubmit={handleSubmit}
      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-white text-right">
        {existing ? "ویرایش نظر" : "نوشتن نظر"}
      </h3>

      <div>
        <p className="text-sm text-zinc-500 mb-2 text-right">امتیاز شما</p>
        <StarInput value={rating} onChange={setRating} size={7} />
      </div>

      <Input
        placeholder="خلاصه (اختیاری)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        className="bg-white dark:bg-zinc-800 text-right"
      />

      <Textarea
        placeholder="تجربه خود را به اشتراک بگذارید..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        rows={4}
        className="bg-white dark:bg-zinc-800 resize-none text-right"
      />

      <div className="flex gap-3 justify-start">
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}>
            لغو
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            "در حال ارسال..."
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              {existing ? "ویرایش نظر" : "ثبت نظر"}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

// ── Single Review Card ─────────────────────────────────────
const ReviewCard = ({ feedback, currentUserId }) => {
  const { deleteFeedback } = useFeedbackStore();
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const isOwner = feedback.user?._id === currentUserId;

  const handleDelete = async () => {
    const result = await deleteFeedback(deleteId);
    if (result.success) toast.success("نظر حذف شد");
    else toast.error(result.error);
    setDeleteId(null);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="py-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={feedback.user?.avatar} />
              <AvatarFallback className="text-xs bg-zinc-200 dark:bg-zinc-700">
                {feedback.user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium text-sm text-zinc-900 dark:text-white">
                {feedback.user?.name || "ناشناس"}
              </p>
              <p className="text-xs text-zinc-400">
                {new Date(feedback.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarDisplay value={feedback.rating} />
            {isOwner && (
              <div className="flex gap-1 mr-2">
                {feedback.status !== "approved" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(feedback._id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {feedback.title && (
          <p className="font-semibold text-zinc-900 dark:text-white mb-1 text-right">
            {feedback.title}
          </p>
        )}

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-right">
          {feedback.comment}
        </p>

        {feedback.isVerifiedPurchase && (
          <Badge
            variant="outline"
            className="mt-3 text-xs text-emerald-600 border-emerald-200"
          >
            ✓ کرایه تایید شده
          </Badge>
        )}

        {feedback.adminReply && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl text-right">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1 justify-end">
              <MessageSquare className="w-3 h-3" />
              پاسخ از طرف مالک
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {feedback.adminReply}
            </p>
          </div>
        )}

        <AnimatePresence>
          {editing && (
            <div className="mt-4">
              <FeedbackForm
                existing={feedback}
                onClose={() => setEditing(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              حذف این نظر؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              این اقدام قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 mr-2 sm:mr-0 sm:ml-2"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── Main CarReviews Component ──────────────────────────────
export const CarReviews = ({ carId, bookingId }) => {
  const user = useAuthStore((state) => state.user);
  const {
    carFeedback,
    ratingBreakdown,
    pagination,
    loading,
    fetchCarFeedback,
    clearCarFeedback,
  } = useFeedbackStore();

  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState("-createdAt");

  useEffect(() => {
    fetchCarFeedback(carId, 1, 10, sort);
    return () => clearCarFeedback();
  }, [carId, sort]);

  const totalReviews = Object.values(ratingBreakdown).reduce(
    (a, b) => a + b,
    0,
  );
  const avgRating =
    totalReviews > 0
      ? Object.entries(ratingBreakdown).reduce(
          (sum, [star, count]) => sum + Number(star) * count,
          0,
        ) / totalReviews
      : 0;

  const canReview = !!bookingId && !!user;
  const alreadyReviewed = carFeedback.some((f) => f.user?._id === user?._id);

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          نظرات
        </h2>
        {canReview && !alreadyReviewed && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Star className="w-4 h-4 ml-2" />
            نوشتن نظر
          </Button>
        )}
      </div>

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <div className="mb-8">
            <FeedbackForm
              carId={carId}
              bookingId={bookingId}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          {/* Average */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-zinc-900 dark:text-white leading-none">
                {avgRating.toFixed(1)}
              </p>
              <StarDisplay value={Math.round(avgRating)} size={5} />
              <p className="text-sm text-zinc-400 mt-1">{totalReviews} نظر</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                label={star}
                count={ratingBreakdown[star]}
                total={totalReviews}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      {carFeedback.length > 0 && (
        <div className="flex gap-2 mb-6">
          {[
            { label: "جدیدترین", value: "-createdAt" },
            { label: "بالاترین امتیاز", value: "-rating" },
            { label: "پایین‌ترین امتیاز", value: "rating" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm transition-colors border",
                sort === opt.value
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="py-6 border-b border-zinc-100 dark:border-zinc-800 animate-pulse"
            >
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : carFeedback.length === 0 ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p className="font-semibold text-zinc-900 dark:text-white mb-1">
            هنوز نظری ثبت نشده است
          </p>
          <p className="text-sm text-zinc-400">
            {canReview
              ? "اولین نفری باشید که تجربه خود را به اشتراک می‌گذارد."
              : "نظرات پس از اتمام کرایه در اینجا نمایش داده می‌شوند."}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {carFeedback.map((feedback) => (
            <ReviewCard
              key={feedback._id}
              feedback={feedback}
              currentUserId={user?._id}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Load More */}
      {pagination.currentPage < pagination.totalPages && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() =>
              fetchCarFeedback(carId, pagination.currentPage + 1, 10, sort)
            }
            disabled={loading}
          >
            <ChevronDown className="w-4 h-4 ml-2" />
            بارگذاری نظرات بیشتر
          </Button>
        </div>
      )}
    </section>
  );
};
