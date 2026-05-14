import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const CarSorting = ({ value, order, onSortChange }) => {
  const getSelectValue = () => {
    const sortValue = value || "createdAt";
    const sortOrder = order || "desc";

    const cleanValue = sortValue.startsWith("-")
      ? sortValue.substring(1)
      : sortValue;
    return `${cleanValue}-${sortOrder}`;
  };

  const handleSortChange = (newValue) => {
    const [sortBy, sortOrder] = newValue.split("-");
    onSortChange(sortBy, sortOrder);
  };

  return (
    <div className="flex items-center space-x-4 space-x-reverse" dir="rtl">
      <Label
        htmlFor="sort"
        className="text-sm font-medium whitespace-nowrap px-2"
      >
        مرتب‌سازی :
      </Label>
      <Select value={getSelectValue()} onValueChange={handleSortChange}>
        <SelectTrigger id="sort" className="w-50 text-right">
          <SelectValue placeholder="مرتب‌سازی" />
        </SelectTrigger>
        <SelectContent className="cursor-pointer">
          <SelectItem value="createdAt-desc" className="text-right">
            جدیدترین اول
          </SelectItem>
          <SelectItem value="createdAt-asc" className="text-right">
            قدیمی‌ترین اول
          </SelectItem>
          <SelectItem value="pricePerDay-asc" className="text-right">
            قیمت: کم به زیاد
          </SelectItem>
          <SelectItem value="pricePerDay-desc" className="text-right">
            قیمت: زیاد به کم
          </SelectItem>
          <SelectItem value="name-asc" className="text-right">
            نام: الف تا ی
          </SelectItem>
          <SelectItem value="name-desc" className="text-right">
            نام: ی تا الف
          </SelectItem>
          <SelectItem value="year-desc" className="text-right">
            سال: جدیدترین اول
          </SelectItem>
          <SelectItem value="year-asc" className="text-right">
            سال: قدیمی‌ترین اول
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
