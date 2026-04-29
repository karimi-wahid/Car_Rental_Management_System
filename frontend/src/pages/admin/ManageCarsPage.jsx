import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Car,
  Fuel,
  Gauge,
  Users,
  X,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";
import useCarStore from "@/store/carStore";
import { useNavigate } from "react-router-dom";

const CarForm = ({ formData, setFormData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrls, setImageUrls] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");

  // Handle file upload
  const handleFileChange = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...newFiles],
    }));
  };

  const removeImageFile = (id) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((item) => item.id !== id),
    }));
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  // Add image URLs
  const handleUrlChange = (e) => {
    const urls = e.target.value;
    setImageUrls(urls);
    const urlArray = urls.split("\n").filter((url) => url.trim());
    setFormData({ ...formData, images: urlArray });
  };

  // Remove image URL
  const removeImageUrl = (index) => {
    const newUrls = [...formData.images];
    newUrls.splice(index, 1);
    setFormData({ ...formData, images: newUrls });
    setImageUrls(newUrls.join("\n"));
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">نام موتر</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">برند</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="carModel">مدل</Label>
          <Input
            id="carModel"
            value={formData.carModel}
            onChange={(e) =>
              setFormData({ ...formData, carModel: e.target.value })
            }
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">سال</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value) })
            }
            className="text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seats">تعداد چوکی</Label>
          <Input
            id="seats"
            type="number"
            value={formData.seats}
            onChange={(e) =>
              setFormData({ ...formData, seats: parseInt(e.target.value) })
            }
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricePerDay">قیمت فی روز ($)</Label>
          <Input
            id="pricePerDay"
            type="number"
            value={formData.pricePerDay}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerDay: parseInt(e.target.value),
              })
            }
            className="text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transmission">گیربکس</Label>
          <Select
            value={formData.transmission}
            onValueChange={(value) =>
              setFormData({ ...formData, transmission: value })
            }
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"automatic"} className="text-right">
                اتوماتیک
              </SelectItem>
              <SelectItem value={"manual"} className="text-right">
                گیر
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelType">نوع تیل</Label>
          <Select
            value={formData.fuelType}
            onValueChange={(value) =>
              setFormData({ ...formData, fuelType: value })
            }
          >
            <SelectTrigger className="text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="licensePlate">نمبر پلیت</Label>
        <Input
          id="licensePlate"
          value={formData.licensePlate}
          onChange={(e) =>
            setFormData({ ...formData, licensePlate: e.target.value })
          }
          className="text-right"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">کیلومتر (اختیاری)</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) =>
              setFormData({ ...formData, mileage: parseInt(e.target.value) })
            }
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">رنگ (اختیاری)</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="text-right"
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-3">
        <Label>تصاویر موتر</Label>

        {/* Upload Method Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMethod("file")}
          >
            آپلود فایل
          </Button>
          <Button
            type="button"
            variant={uploadMethod === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMethod("url")}
          >
            لینک تصویر
          </Button>
        </div>

        {uploadMethod === "file" ? (
          <>
            {/* Drag & Drop Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition ${
                dragActive ? "border-primary bg-primary/10" : "border-muted"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e.target.files)}
              />

              {/* ✅ Existing images from server */}
              {formData.existingImages?.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    تصاویر فعلی
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.existingImages.map((item) => (
                      <div
                        key={item.id}
                        className="relative rounded-lg overflow-hidden border"
                      >
                        <img
                          src={item.preview}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // ✅ Remove from preview + add to deletedImages list
                            setFormData((prev) => ({
                              ...prev,
                              existingImages: prev.existingImages.filter(
                                (i) => i.id !== item.id,
                              ),
                              deletedImages: [
                                ...(prev.deletedImages || []),
                                item.id,
                              ],
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & Drop یا کلیک برای انتخاب تصویر
                </p>
              </div>
            </div>

            {/* 🔥 IMAGE PREVIEW GRID */}
            {formData.imageFiles?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.imageFiles.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    <img
                      src={item.preview}
                      className="w-full h-32 object-cover"
                    />

                    {/* ❌ Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImageFile(item.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* URL Input Area */}
            <Textarea
              id="images"
              placeholder="لینک تصاویر را وارد کنید (هر لینک در یک خط)"
              value={imageUrls}
              onChange={handleUrlChange}
              rows={3}
              className="text-left"
              dir="ltr"
            />

            {/* Preview URLs */}
            {formData.images?.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">لینک‌های تصویر:</Label>
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm truncate" dir="ltr">
                            {url}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">ویژگی‌ها (یک ویژگی در هر خط)</Label>
        <Textarea
          id="features"
          value={formData.features.join("\n")}
          onChange={(e) =>
            setFormData({
              ...formData,
              features: e.target.value.split("\n").filter((f) => f.trim()),
            })
          }
          rows={3}
          className="text-right"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="text-right"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="availability"
          checked={formData.availability}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, availability: checked })
          }
        />
        <Label htmlFor="availability">قابل رزرو</Label>
      </div>
    </div>
  );
};

const ManageCarsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const { setFilters } = useCarStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    carModel: "",
    year: new Date().getFullYear(),
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    pricePerDay: 0,
    images: [""],
    imageFiles: [],
    description: "",
    features: [""],
    licensePlate: "",
    mileage: 0,
    color: "",
    availability: true,
  });
  const {
    cars,
    loading,
    error,
    pagination,
    fetchCars,
    createCar,
    updateCar,
    deleteCar,
    toggleAvailability,
  } = useCarStore();

  useEffect(() => {
    if (statusFilter === "all") {
      setFilters("availability", "");
    } else {
      setFilters("availability", statusFilter === "available");
    }
    fetchCars(pagination.currentPage, pagination.itemsPerPage);
  }, [
    statusFilter,
    pagination.currentPage,
    pagination.itemsPerPage,
    fetchCars,
    setFilters,
  ]);

  const handleAddCar = async () => {
    try {
      const form = new FormData();

      // basic fields
      form.append("name", formData.name);
      form.append("brand", formData.brand);
      form.append("carModel", formData.carModel);
      form.append("year", formData.year);
      form.append("seats", formData.seats);
      form.append("transmission", formData.transmission);
      form.append("fuelType", formData.fuelType);
      form.append("pricePerDay", formData.pricePerDay);
      form.append("description", formData.description);
      form.append("licensePlate", formData.licensePlate);
      form.append("mileage", formData.mileage);
      form.append("color", formData.color);

      // ✅ important conversions
      form.append("availability", JSON.stringify(formData.availability));
      form.append("features", JSON.stringify(formData.features));

      // ✅ separate URLs
      form.append("imageUrls", JSON.stringify(formData.images));

      // ✅ files
      formData.imageFiles.forEach((item) => {
        form.append("images", item.file);
      });

      // // 🔍 DEBUG
      // for (let pair of form.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      await createCar(form);

      toast.success("موتر موفقانه اضافه شد");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Upload failed");
    }
  };

  const handleEditCar = async () => {
    if (!selectedCar) return;

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("brand", formData.brand);
      form.append("carModel", formData.carModel);
      form.append("year", formData.year);
      form.append("seats", formData.seats);
      form.append("transmission", formData.transmission);
      form.append("fuelType", formData.fuelType);
      form.append("pricePerDay", formData.pricePerDay);
      form.append("description", formData.description);
      form.append("licensePlate", formData.licensePlate);
      form.append("mileage", formData.mileage);
      form.append("color", formData.color);
      form.append("availability", JSON.stringify(formData.availability));
      form.append("features", JSON.stringify(formData.features));

      // ✅ Tell backend which images to delete
      form.append(
        "deletedImages",
        JSON.stringify(formData.deletedImages || []),
      );

      // ✅ New file uploads
      formData.imageFiles.forEach((item) => {
        form.append("images", item.file);
      });

      await updateCar(selectedCar._id, form); // make sure updateCar sends as FormData
      toast.success("موتر موفقانه ویرایش شد");
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error("ویرایش موتر ناموفق بود");
      console.log(err);
    }
  };

  const handleToggleAvailability = async (id, current) => {
    try {
      await toggleAvailability(id);
      toast.success(
        `موتر حالا ${current ? "غیرقابل دسترس" : "قابل دسترس"} است`,
      );
    } catch (err) {
      //toast.error("تغییر وضعیت دسترسی ناموفق بود");
      toast.error(error);
      console.log(error);
    }
  };

  const openEditDialog = (car) => {
    setSelectedCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      carModel: car.carModel,
      year: car.year,
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      pricePerDay: car.pricePerDay,
      description: car.description,
      features: car.features,
      licensePlate: car.licensePlate,
      mileage: car.mileage || 0,
      color: car.color || "",
      availability: car.availability,
      images: car.images.map((img) => img.url), // existing URL strings
      imageFiles: [], // new file uploads (empty)
      // ✅ existing images shown as previews with their server IDs
      existingImages: car.images.map((img) => ({
        id: img._id || img.public_id || img.url, // whatever your backend uses
        url: img.url,
        preview: img.url,
      })),
      deletedImages: [], // ✅ track which to delete
    });
    setIsEditDialogOpen(true);
  };

  const filteredCars = cars.filter(
    (car) =>
      (car.name &&
        car.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.brand &&
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.licensePlate &&
        car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      <PageHeader
        title="مدیریت موترها"
        description="موترهای جدید اضافه کنید، ویرایش کنید و مدیریت نمایید"
        actions={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                اضافه کردن موتر جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right">
                  اضافه کردن موتر جدید
                </DialogTitle>
                <DialogDescription className="text-right">
                  جزئیات را برای اضافه کردن موتر جدید وارد کنید.
                </DialogDescription>
              </DialogHeader>
              <CarForm formData={formData} setFormData={setFormData} />
              <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  لغو
                </Button>
                <Button onClick={handleAddCar} className="mr-2 sm:mr-0 sm:ml-2">
                  اضافه کردن
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام، برند یا نمبر پلیت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-37.5">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-right">
                  همه موترها
                </SelectItem>
                <SelectItem value="available" className="text-right">
                  قابل دسترس
                </SelectItem>
                <SelectItem value="unavailable" className="text-right">
                  غیرقابل دسترس
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">در حال بارگذاری موترها...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">موتر</TableHead>
                    <TableHead className="text-right">جزئیات</TableHead>
                    <TableHead className="text-right">قیمت</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <TableRow key={car._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={car.images[0]?.url}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-right">{car.name}</p>
                            <p className="text-sm text-muted-foreground text-right">
                              {car.brand} {car.carModel} • {car.year}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Users className="w-3 h-3 ml-1" />
                            {car.seats}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Fuel className="w-3 h-3 ml-1" />
                            {car.fuelType === "petrol" && "پطرول"}
                            {car.fuelType === "diesel" && "دیزل"}
                            {car.fuelType === "electric" && "برقی"}
                            {car.fuelType === "hybrid" && "هایبرید"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Gauge className="w-3 h-3 ml-1" />
                            {car.transmission === "automatic"
                              ? "اتوماتیک"
                              : "دستی"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          پلیت: {car.licensePlate}
                        </p>
                      </TableCell>
                      <TableCell className="font-semibold text-right">
                        {formatCurrency(car.pricePerDay)}
                        <span className="text-xs text-muted-foreground mr-1">
                          / روز
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          {car.availability ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">قابل دسترس</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm">غیرقابل دسترس</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel className="text-right">
                              عملیات
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(car)}
                              className="flex-row-reverse"
                            >
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/cars/${car._id}`)}
                              className="flex-row-reverse"
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              مشاهده
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleAvailability(
                                  car._id,
                                  car.availability,
                                )
                              }
                              className="flex-row-reverse"
                            >
                              {car.availability ? (
                                <>
                                  <XCircle className="w-4 h-4 ml-2" />
                                  غیرقابل دسترس کردن
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 ml-2" />
                                  قابل دسترس کردن
                                </>
                              )}
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 flex-row-reverse"
                                  onSelect={(e) => e.preventDefault()} // prevent dropdown close bug
                                >
                                  <Trash2 className="w-4 h-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right">
                                    آیا مطمئن هستید؟
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-right">
                                    این عمل قابل بازگشت نیست. این موتر به‌طور
                                    دائمی حذف خواهد شد.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter className="flex-row-reverse">
                                  <AlertDialogCancel>لغو</AlertDialogCancel>

                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={async () => {
                                      try {
                                        await deleteCar(car._id);
                                        toast.success("موتر موفقانه حذف شد");
                                      } catch (error) {
                                        toast.error("حذف موتر ناموفق بود");
                                        console.log(error);
                                      }
                                    }}
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={(page) => fetchCars(page)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">هیچ موتری یافت نشد</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? `نتیجه‌ای برای "${searchQuery}" یافت نشد`
                  : "شما هنوز هیچ موتری اضافه نکرده‌اید."}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                اضافه کردن اولین موتر
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">ویرایش موتر</DialogTitle>
            <DialogDescription className="text-right">
              جزئیات موتر را به‌روز کنید.
            </DialogDescription>
          </DialogHeader>
          <CarForm formData={formData} setFormData={setFormData} />
          <DialogFooter className="flex-row-reverse sm:flex-row-reverse">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              لغو
            </Button>
            <Button onClick={handleEditCar} className="mr-2 sm:mr-0 sm:ml-2">
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ManageCarsPage;
