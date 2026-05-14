import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Heart,
  Reply,
  Edit2,
  Trash2,
  Send,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import useCommentStore from "@/store/commentStore";

// ── Time ago helper ───────────────────────────────────────────
const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return new Date(date).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
  });
};

const CommentInput = ({
  carId,
  parentId = null,
  placeholder = "نظر خود را بنویسید...",
  onSuccess,
  onCancel,
  initialValue = "",
  isEdit = false,
  commentId,
}) => {
  const { createComment, updateComment, submitting } = useCommentStore();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = async () => {
    if (!value.trim()) return;

    const result = isEdit
      ? await updateComment(commentId, value, parentId)
      : await createComment(carId, value, parentId);

    if (result.success) {
      toast.success(isEdit ? "نظر ویرایش شد" : "نظر ارسال شد");
      setValue("");
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          maxLength={500}
          className="resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-400 text-right"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{value.length}/۵۰۰</span>
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                لغو
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitting || !value.trim()}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 ml-1.5" />
                  {isEdit ? "ویرایش" : "ارسال"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Single Comment ────────────────────────────────────────────
const CommentItem = ({ comment, carId, currentUser, isReply = false }) => {
  const { deleteComment, toggleLike, fetchMoreReplies } = useCommentStore();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isOwner = comment.user?._id === currentUser?._id;
  const isLiked = comment.liked;
  const likeCount = comment.likeCount ?? comment.likes?.length ?? 0;
  const replies = comment.replies || [];
  const replyCount = comment.replyCount ?? replies.length;

  const handleDelete = async () => {
    const result = await deleteComment(
      deleteId,
      isReply ? comment.parent : null,
    );
    if (result.success) toast.success("نظر حذف شد");
    else toast.error(result.error);
    setDeleteId(null);
  };

  const handleLike = async () => {
    if (!currentUser) return toast.error("لطفاً برای لایک کردن وارد شوید");
    try {
      await toggleLike(comment._id, isReply ? comment.parent : null);
    } catch {
      toast.error("به‌روزرسانی لایک ناموفق بود");
    }
  };

  const handleLoadReplies = async () => {
    if (!showReplies) {
      setShowReplies(true);
      if (replies.length === 0 && replyCount > 0) {
        setLoadingReplies(true);
        try {
          await fetchMoreReplies(comment._id, 1);
        } finally {
          setLoadingReplies(false);
        }
      }
    } else {
      setShowReplies(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className={cn(
          "group",
          isReply && "pr-4 border-r-2 border-zinc-100 dark:border-zinc-800",
        )}
      >
        <div className="flex gap-3">
          <Avatar className={cn("shrink-0", isReply ? "w-7 h-7" : "w-9 h-9")}>
            <AvatarImage src={comment.user?.avatar} />
            <AvatarFallback className="text-xs bg-zinc-200 dark:bg-zinc-700">
              {comment.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-sm text-zinc-900 dark:text-white">
                {comment.user?.name || "ناشناس"}
              </span>
              <span className="text-xs text-zinc-400">
                {timeAgo(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-zinc-400">(ویرایش شده)</span>
              )}
              {comment.status === "pending" && isOwner && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 px-1.5 text-amber-600 border-amber-200"
                >
                  در انتظار تایید
                </Badge>
              )}
            </div>

            {editing ? (
              <CommentInput
                carId={carId}
                parentId={isReply ? comment.parent : null}
                commentId={comment._id}
                initialValue={comment.content}
                isEdit
                onSuccess={() => setEditing(false)}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed wrap-break-word text-right">
                {comment.content}
              </p>
            )}

            {/* Admin reply */}
            {comment.adminReply && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl text-right">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  پاسخ از طرف تیم
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  {comment.adminReply}
                </p>
              </div>
            )}

            {/* Actions */}
            {!editing && (
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    isLiked
                      ? "text-rose-500"
                      : "text-zinc-400 hover:text-rose-500",
                  )}
                >
                  <Heart
                    className={cn("w-3.5 h-3.5", isLiked && "fill-rose-500")}
                  />
                  {likeCount > 0 && likeCount}
                </button>

                {!isReply && currentUser && (
                  <button
                    onClick={() => setReplying(!replying)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    پاسخ
                  </button>
                )}

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {comment.status !== "approved" && (
                        <DropdownMenuItem
                          onClick={() => setEditing(true)}
                          className="flex-row-reverse"
                        >
                          <Edit2 className="w-3.5 h-3.5 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setDeleteId(comment._id)}
                        className="text-destructive flex-row-reverse"
                      >
                        <Trash2 className="w-3.5 h-3.5 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {/* Reply input */}
            <AnimatePresence>
              {replying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <CommentInput
                    carId={carId}
                    parentId={comment._id}
                    placeholder={`پاسخ به ${comment.user?.name}...`}
                    onSuccess={() => {
                      setReplying(false);
                      setShowReplies(true);
                    }}
                    onCancel={() => setReplying(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load replies toggle */}
            {!isReply && replyCount > 0 && (
              <button
                onClick={handleLoadReplies}
                className="flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
              >
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    showReplies && "rotate-180",
                  )}
                />
                {showReplies ? "مخفی کردن" : `نمایش ${replyCount}`} پاسخ
              </button>
            )}

            {/* Replies */}
            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {loadingReplies ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    </div>
                  ) : (
                    <AnimatePresence>
                      {replies.map((reply) => (
                        <CommentItem
                          key={reply._id}
                          comment={reply}
                          carId={carId}
                          currentUser={currentUser}
                          isReply
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              حذف این نظر؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              این کار تمام پاسخ‌ها را نیز حذف خواهد کرد. این اقدام قابل بازگشت
              نیست.
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

// ── Main CarComments Component ────────────────────────────────
export const CarComments = ({ carId }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    carComments,
    pagination,
    loading,
    fetchCarComments,
    clearCarComments,
  } = useCommentStore();

  useEffect(() => {
    fetchCarComments(carId, 1);
    return () => clearCarComments();
  }, [carId]);

  const handleLoadMore = () => {
    fetchCarComments(carId, pagination.currentPage + 1);
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-5 h-5 text-zinc-500" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          نظرات
        </h2>
        {pagination.totalItems > 0 && (
          <Badge variant="secondary">{pagination.totalItems}</Badge>
        )}
      </div>

      {/* Input for logged-in users */}
      {isAuthenticated ? (
        <div className="mb-8 flex gap-3">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs bg-zinc-200 dark:bg-zinc-700">
              {user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CommentInput
              carId={carId}
              placeholder="نظر خود را به اشتراک بگذارید..."
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 mb-3">
            برای پیوستن به گفتگو وارد شوید
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/login">ورود</a>
          </Button>
        </div>
      )}

      {/* Comment list */}
      {loading && carComments.length >= 0 ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <li>{carComments}</li>
              <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded" />
                <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : carComments.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p className="font-semibold text-zinc-900 dark:text-white mb-1">
            هنوز نظری وجود ندارد
          </p>
          <p className="text-sm text-zinc-400">
            اولین نفری باشید که نظر می‌دهد.
          </p>
        </div>
      ) : (
        <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800">
          <AnimatePresence initial={false}>
            {carComments.map((comment) => (
              <div key={comment._id} className="pt-6 first:pt-0">
                <CommentItem
                  comment={comment}
                  carId={carId}
                  currentUser={user}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load more */}
      {pagination.currentPage < pagination.totalPages && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
            بارگذاری نظرات بیشتر
          </Button>
        </div>
      )}
    </section>
  );
};
