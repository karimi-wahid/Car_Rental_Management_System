import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Fuel,
  Gauge,
  Users,
  Calendar,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const CarCard = ({ car, index }) => {
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
      dir="rtl"
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={car.images[0].url}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-2">
            <Badge className="bg-primary/90 hover:bg-primary">
              {getTransmissionText(car.transmission)}
            </Badge>
            <Badge variant="secondary" className="bg-background/90">
              {getFuelTypeText(car.fuelType)}
            </Badge>
            {!car.availability && (
              <Badge variant="destructive">غیرقابل دسترس</Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 left-4 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="text-lg px-4 py-2 bg-background/90 text-foreground">
              {formatCurrency(car.pricePerDay)}
              <span className="text-xs text-muted-foreground mr-1">/ روز</span>
            </Badge>
          </div>

          {/* Year Badge */}
          <div className="absolute bottom-4 right-4">
            <Badge
              variant="outline"
              className="bg-background/50 backdrop-blur-sm"
            >
              <Calendar className="w-3 h-3 ml-1" />
              {car.year}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-2">
          <div className="mb-2">
            <h3 className="text-2xl font-bold mb-1 line-clamp-1 text-right">
              {car.name}
            </h3>
            <p className="text-muted-foreground flex items-center justify-end">
              <Car className="w-4 h-4 ml-1" />
              {car.brand} {car.model}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Users className="w-3 h-3 mx-auto mb-1 text-primary" />
              <span className="text-xs font-medium">{car.seats} صندلی</span>
            </div>
            <div className="text-center">
              <Gauge className="w-3 h-3 mx-auto mb-1 text-primary" />
              <span className="text-xs font-medium">
                {car.mileage || "۰"} کیلومتر
              </span>
            </div>
            <div className="text-center">
              <Fuel className="w-3 h-3 mx-auto mb-1 text-primary" />
              <span className="text-xs font-medium">
                {getFuelTypeText(car.fuelType)}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6 justify-end">
            {car.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {car.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                {car.features.length - 3}+ بیشتر
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button
            className="w-full group"
            onClick={() => navigate(`/cars/${car._id}`)}
            disabled={!car.availability}
          >
            {car.availability ? (
              <>
                مشاهده جزئیات
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </>
            ) : (
              "در حال حاضر غیرقابل دسترس"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
