import {
  Car,
  Fuel,
  Gauge,
  Users,
  Calendar,
  Palette,
  Hash,
  Award,
  Wind,
  Thermometer,
  Bluetooth,
  Wifi,
  Coffee,
  BatteryCharging,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CarSpecs = ({ car }) => {
  const getTransmissionText = (transmission) => {
    return transmission === "automatic" ? "اتوماتیک" : "دستی";
  };

  const getFuelTypeText = (fuelType) => {
    switch (fuelType) {
      case "petrol":
        return "پطرول";
      case "diesel":
        return "دیزل";
      case "electric":
        return "برقی";
      case "hybrid":
        return "هایبرید";
      default:
        return fuelType;
    }
  };

  const specs = [
    { icon: Car, label: "برند", value: car.brand },
    { icon: Car, label: "مدل", value: car.carModel },
    { icon: Calendar, label: "سال", value: car.year },
    { icon: Users, label: "صندلی", value: `${car.seats} نفر` },
    {
      icon: Gauge,
      label: "گیربکس",
      value: getTransmissionText(car.transmission),
    },
    { icon: Fuel, label: "نوع تیل", value: getFuelTypeText(car.fuelType) },
    {
      icon: Gauge,
      label: "کیلومتراژ",
      value: car.mileage ? `${car.mileage} کیلومتر` : "نامشخص",
    },
    { icon: Palette, label: "رنگ", value: car.color || "نامشخص" },
    { icon: Hash, label: "نمبر پلیت", value: car.licensePlate },
  ];

  // Map features to icons with Persian labels
  const featureIcons = {
    "Air Conditioning": { icon: Wind, label: "تهویه مطبوع" },
    "Heated Seats": { icon: Thermometer, label: "صندلی گرم‌شونده" },
    Bluetooth: { icon: Bluetooth, label: "بلوتوث" },
    WiFi: { icon: Wifi, label: "وای‌فای" },
    GPS: { icon: Award, label: "جی‌پی‌اس" },
    "Coffee Machine": { icon: Coffee, label: "قهوه‌ساز" },
    "USB Charger": { icon: BatteryCharging, label: "شارژر یو‌اس‌بی" },
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Key Specs Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-right">مشخصات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-muted/30 rounded-lg"
            >
              <spec.icon className="w-5 h-5 text-primary ml-3" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{spec.label}</p>
                <p className="font-medium">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-right">توضیحات</h3>
        <p className="text-muted-foreground leading-relaxed text-right">
          {car.description}
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-right">
          ویژگی‌ها و امکانات
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {car.features.map((feature, index) => {
            const featureData = featureIcons[feature] || {
              icon: Award,
              label: feature,
            };
            const Icon = featureData.icon;
            return (
              <div
                key={index}
                className="flex items-center p-2 bg-muted/30 rounded-lg"
              >
                <Icon className="w-4 h-4 text-primary ml-2" />
                <span className="text-sm">{featureData.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability Badge */}
      <div className="flex items-center gap-3">
        <Badge
          variant={car.availability ? "default" : "destructive"}
          className="px-4 py-2"
        >
          {car.availability ? "قابل رزرو" : "در حال حاضر غیرقابل دسترس"}
        </Badge>
        {!car.availability && (
          <p className="text-sm text-muted-foreground">
            این موتر موقتاً غیرقابل دسترس است. لطفاً بعداً مراجعه کنید.
          </p>
        )}
      </div>
    </div>
  );
};
