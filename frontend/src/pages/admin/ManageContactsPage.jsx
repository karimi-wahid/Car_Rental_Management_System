import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  MailOpen,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Reply,
  AlertTriangle,
  Search,
  Eye,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import useContactStore from "@/store/contactStore";

// ── Config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  unread: {
    label: "خوانده نشده",
    icon: Mail,
    color:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  },
  read: {
    label: "خوانده شده",
    icon: MailOpen,
    color:
      "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  },
  replied: {
    label: "پاسخ داده",
    icon: CheckCircle,
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  closed: {
    label: "بسته شده",
    icon: XCircle,
    color:
      "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700",
  },
};

const SUBJECT_LABELS = {
  general: "عمومی",
  booking: "رزرو",
  complaint: "شکایت",
  partnership: "همکاری",
  other: "سایر",
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.read;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        cfg.color,
      )}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "همین الان";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  return new Date(date).toLocaleDateString("fa-IR");
};

// ── Detail Panel ──────────────────────────────────────────────
const ContactDetailPanel = ({ contact, onClose }) => {
  const { replyToContact, updateStatus, markAsSpam, submitting } =
    useContactStore();
  const [replyText, setReplyText] = useState(contact.adminReply || "");
  const [deleteId, setDeleteId] = useState(null);
  const { deleteContact } = useContactStore();

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const result = await replyToContact(contact._id, replyText);
    if (result.success) toast.success("پاسخ ارسال شد");
    else toast.error(result.error);
  };

  const handleSpam = async () => {
    const result = await markAsSpam(contact._id);
    if (result.success) {
      toast.success("به عنوان اسپم علامت‌گذاری شد");
      onClose();
    } else toast.error(result.error);
  };

  const handleDelete = async () => {
    const result = await deleteContact(deleteId);
    if (result.success) {
      toast.success("پیام حذف شد");
      onClose();
    } else toast.error(result.error);
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={contact.status} />
          <Select
            value={contact.status}
            onValueChange={(val) => updateStatus(contact._id, val)}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Sender info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11">
            <AvatarImage src={contact.user?.avatar} />
            <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700">
              {contact.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {contact.name}
            </p>
            <p className="text-sm text-zinc-400">{contact.email}</p>
            {contact.phone && (
              <p className="text-xs text-zinc-400">{contact.phone}</p>
            )}
          </div>
        </div>

        {/* Subject & time */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline">
            {SUBJECT_LABELS[contact.subject] || contact.subject}
          </Badge>
          <span className="text-xs text-zinc-400">
            {timeAgo(contact.createdAt)}
          </span>
          {contact.bookingId && (
            <Badge variant="secondary" className="text-xs">
              رزرو: {contact.bookingId._id?.slice(-6).toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Message */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>

        {/* Previous reply */}
        {contact.adminReply && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              پاسخ ارسال شده
              {contact.adminRepliedAt && (
                <span className="font-normal text-emerald-500 mr-1">
                  — {timeAgo(contact.adminRepliedAt)}
                </span>
              )}
            </p>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {contact.adminReply}
            </p>
          </div>
        )}

        {/* Reply box */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {contact.adminReply ? "ویرایش پاسخ" : "ارسال پاسخ"}
          </p>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={5}
            placeholder="پاسخ خود را بنویسید..."
            className="resize-none bg-white dark:bg-zinc-900"
            maxLength={2000}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">
              {replyText.length}/2000
            </span>
            <Button
              onClick={handleReply}
              disabled={submitting || !replyText.trim()}
              size="sm"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Reply className="w-4 h-4 mr-2" />
              )}
              ارسال پاسخ
            </Button>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="text-amber-600 border-amber-200 hover:bg-amber-50"
          onClick={handleSpam}
        >
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          اسپم
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => setDeleteId(contact._id)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          حذف
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف این پیام؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const AdminContactsPage = () => {
  const {
    contacts,
    summary,
    pagination,
    loading,
    fetchAllContacts,
    fetchContactById,
    selectedContact,
    setSelectedContact,
  } = useContactStore();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetchAllContacts(1, 20, {
      status: activeTab === "all" ? "" : activeTab,
      subject,
      search,
    });
  }, [activeTab, subject]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchAllContacts(1, 20, {
        status: activeTab === "all" ? "" : activeTab,
        subject,
        search,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleOpen = async (contact) => {
    try {
      await fetchContactById(contact._id);
    } catch {
      toast.error("خطا در بارگذاری پیام");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden" dir="rtl">
      {/* ── List panel ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "flex flex-col border-l border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-200",
          selectedContact ? "hidden lg:flex lg:w-96" : "flex w-full",
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <PageHeader title="مدیریت پیام ها" description="مدیریت پیام ها" />

            <div className="flex gap-2 text-xs">
              {summary.unread > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 font-medium">
                  {summary.unread} جدید
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 text-sm"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 h-8">
              <TabsTrigger value="unread" className="text-xs">
                جدید {summary.unread > 0 && `(${summary.unread})`}
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">
                خوانده
              </TabsTrigger>
              <TabsTrigger value="replied" className="text-xs">
                پاسخ
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                همه
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Subject filter */}
          <Select
            value={subject || "all"}
            onValueChange={(v) => setSubject(v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="همه موضوعات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه موضوعات</SelectItem>
              {Object.entries(SUBJECT_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {loading && contacts.length === 0 ? (
            <div className="space-y-1 p-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg animate-pulse flex gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
              <MailOpen className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mb-4" />
              <p className="font-medium text-zinc-900 dark:text-white mb-1">
                هیچ پیامی وجود ندارد
              </p>
              <p className="text-sm text-zinc-400">
                {search ? "نتیجه‌ای یافت نشد" : "همه پیام‌ها مدیریت شده‌اند"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => handleOpen(contact)}
                  className={cn(
                    "w-full text-right p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex gap-3",
                    selectedContact?._id === contact._id &&
                      "bg-zinc-100 dark:bg-zinc-900",
                    contact.status === "unread" && "border-r-2 border-blue-500",
                  )}
                >
                  <Avatar className="w-9 h-9 shrink-0 mt-0.5">
                    <AvatarImage src={contact.user?.avatar} />
                    <AvatarFallback className="text-xs bg-zinc-200 dark:bg-zinc-700">
                      {contact.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={cn(
                          "text-sm truncate",
                          contact.status === "unread"
                            ? "font-semibold text-zinc-900 dark:text-white"
                            : "font-medium text-zinc-700 dark:text-zinc-300",
                        )}
                      >
                        {contact.name}
                      </span>
                      <span className="text-xs text-zinc-400 shrink-0">
                        {timeAgo(contact.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mb-1">
                      {SUBJECT_LABELS[contact.subject]} · {contact.email}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {contact.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) =>
                fetchAllContacts(page, 20, {
                  status: activeTab === "all" ? "" : activeTab,
                  subject,
                  search,
                })
              }
            />
          </div>
        )}
      </motion.div>

      {/* ── Detail panel ───────────────────────────── */}
      <div
        className={cn(
          "flex-1 bg-white dark:bg-zinc-950",
          !selectedContact &&
            "hidden lg:flex lg:items-center lg:justify-center",
        )}
      >
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.div
              key={selectedContact._id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ContactDetailPanel
                contact={selectedContact}
                onClose={() => setSelectedContact(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Mail className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">یک پیام انتخاب کنید</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContactsPage;
