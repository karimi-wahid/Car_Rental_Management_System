import { useState } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import useCarStore from "@/store/carStore";

const FilterContent = ({
  filters,
  brands,
  priceRange,
  activeFiltersCount,
  handleFilterChange,
  handlePriceChange,
  clearFilters,
}) => (
  <div className="space-y-6" dir="rtl">
    {/* Search */}
    <div>
      <Label
        htmlFor="search"
        className="text-sm font-medium mb-2 block text-right"
      >
        جستجو
      </Label>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          id="search"
          placeholder="جستجو بر اساس نام، برند..."
          className="pr-9 text-right"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>
    </div>

    <Separator />

    {/* Brand Filter */}
    <div>
      <Label
        htmlFor="brand"
        className="text-sm font-medium mb-2 block text-right"
      >
        برند
      </Label>
      <Select
        value={filters.brand}
        onValueChange={(value) => handleFilterChange("brand", value)}
      >
        <SelectTrigger id="brand" className="text-right">
          <SelectValue placeholder="همه برندها" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-right">
            همه برندها
          </SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand} className="text-right">
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Price Range */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">محدوده قیمت (فی روز)</Label>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
        </span>
      </div>
      <Slider
        min={0}
        max={10000}
        step={1}
        value={priceRange}
        onValueChange={handlePriceChange}
        className="mt-2"
      />
      <div className="flex justify-between mt-3 text-xs text-muted-foreground">
        <span>{formatCurrency(1000)}</span>
        <span>{formatCurrency(0)}</span>
      </div>
    </div>

    {/* Transmission */}
    <div>
      <Label
        htmlFor="transmission"
        className="text-sm font-medium mb-2 block text-right"
      >
        گیربکس
      </Label>
      <Select
        value={filters.transmission}
        onValueChange={(value) => handleFilterChange("transmission", value)}
      >
        <SelectTrigger id="transmission" className="text-right">
          <SelectValue placeholder="همه" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-right">
            همه
          </SelectItem>
          <SelectItem value={"automatic"} className="text-right">
            اتوماتیک
          </SelectItem>
          <SelectItem value={"manual"} className="text-right">
            دستی
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Fuel Type */}
    <div>
      <Label
        htmlFor="fuelType"
        className="text-sm font-medium mb-2 block text-right"
      >
        نوع تیل
      </Label>
      <Select
        value={filters.fuelType}
        onValueChange={(value) => handleFilterChange("fuelType", value)}
      >
        <SelectTrigger id="fuelType" className="text-right">
          <SelectValue placeholder="همه" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-right">
            همه
          </SelectItem>
          <SelectItem value="petrol" className="text-right">
            پطرول
          </SelectItem>
          <SelectItem value="diesel" className="text-right">
            دیزل
          </SelectItem>
          <SelectItem value="electric" className="text-right">
            برقی
          </SelectItem>
          <SelectItem value="hybrid" className="text-right">
            هایبرید
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Seats */}
    <div>
      <Label
        htmlFor="seats"
        className="text-sm font-medium mb-2 block text-right"
      >
        تعداد صندلی
      </Label>
      <Select
        value={filters.seats}
        onValueChange={(value) => handleFilterChange("seats", value)}
      >
        <SelectTrigger id="seats" className="text-right">
          <SelectValue placeholder="همه" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-right">
            همه
          </SelectItem>
          <SelectItem value="2" className="text-right">
            ۲ صندلی
          </SelectItem>
          <SelectItem value="4" className="text-right">
            ۴ صندلی
          </SelectItem>
          <SelectItem value="5" className="text-right">
            ۵ صندلی
          </SelectItem>
          <SelectItem value="7" className="text-right">
            ۷ صندلی
          </SelectItem>
          <SelectItem value="8" className="text-right">
            ۸+ صندلی
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Clear Filters */}
    {activeFiltersCount > 0 && (
      <Button
        variant="ghost"
        onClick={clearFilters}
        className="w-full text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4 ml-2" />
        حذف همه فیلترها ({activeFiltersCount})
      </Button>
    )}
  </div>
);

export const CarFilters = ({ onFilterChange, brands, className }) => {
  const filters = useCarStore((state) => state.filters);
  const setFilters = useCarStore((state) => state.setFilters);
  const clearFilters = useCarStore((state) => state.clearFilters);

  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 10000,
  ]);

  const handleFilterChange = (key, value) => {
    const clean = value === "all" ? "" : value;
    setFilters(key, clean);
    onFilterChange?.(key, clean); // pass key and value to parent
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters("minPrice", value[0]);
    setFilters("maxPrice", value[1]);
    onFilterChange?.("minPrice", value[0]);
    onFilterChange?.("maxPrice", value[1]);
  };

  // Count active filters (excluding empty, 'all', or default values)
  const activeFiltersCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (
        key === "availability" ||
        value === undefined ||
        value === null ||
        value === "" ||
        value === "all"
      ) {
        return count;
      }
      return count + 1;
    },
    0,
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className={cn("hidden lg:block w-80 shrink-0", className)}>
        <div className="sticky top-24 p-6 bg-card rounded-xl border" dir="rtl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center">
              <SlidersHorizontal className="w-4 h-4 ml-2" />
              فیلترها
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </h3>
          </div>
          <FilterContent
            filters={filters}
            brands={brands}
            priceRange={priceRange}
            activeFiltersCount={activeFiltersCount}
            handleFilterChange={handleFilterChange}
            handlePriceChange={handlePriceChange}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full mb-4">
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            فیلترها
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="mr-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-7 sm:w-100 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-right">فیلترها</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent
              filters={filters}
              brands={brands}
              priceRange={priceRange}
              activeFiltersCount={activeFiltersCount}
              handleFilterChange={handleFilterChange}
              handlePriceChange={handlePriceChange}
              clearFilters={clearFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
