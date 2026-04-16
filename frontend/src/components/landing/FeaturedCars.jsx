import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, ArrowRight, Fuel, Gauge, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dummy data
  const dummyCars = [
    {
      _id: "1",
      name: "Model S",
      brand: "Tesla",
      model: "Plaid",
      pricePerDay: 299,
      transmission: "Automatic",
      fuelType: "Electric",
      seats: 5,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
      ],
      features: [
        "Autopilot",
        "Glass Roof",
        '21" Wheels',
        "Premium Sound",
        "Heated Seats",
      ],
    },
    {
      _id: "2",
      name: "M4 Competition",
      brand: "BMW",
      model: "G82",
      pricePerDay: 249,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 4,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
      ],
      features: [
        "M Sport Package",
        "Carbon Fiber",
        "Laser Lights",
        "Harman Kardon",
        "M Seats",
      ],
    },
    {
      _id: "3",
      name: "AMG GT",
      brand: "Mercedes",
      model: "63 S",
      pricePerDay: 399,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 4,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800",
      ],
      features: [
        "V8 Biturbo",
        "AMG Performance",
        "Burmester Sound",
        "Night Package",
        "Carbon Ceramic Brakes",
      ],
    },
    {
      _id: "4",
      name: "Urus",
      brand: "Lamborghini",
      model: "S",
      pricePerDay: 599,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1617654112368-307821291f42?w=800",
      ],
      features: [
        "4.0L V8",
        "AWD",
        "Adaptive Suspension",
        "Panoramic Roof",
        "Bang & Olufsen",
      ],
    },
    {
      _id: "5",
      name: "Taycan",
      brand: "Porsche",
      model: "Turbo",
      pricePerDay: 349,
      transmission: "Automatic",
      fuelType: "Electric",
      seats: 4,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800",
      ],
      features: [
        "Performance Battery",
        "Sport Chrono",
        "Bose Sound",
        "Ambient Lighting",
        "Matrix LED",
      ],
    },
    {
      _id: "6",
      name: "R8",
      brand: "Audi",
      model: "V10 Performance",
      pricePerDay: 449,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 2,
      mileage: "0 mi",
      images: [
        "https://images.unsplash.com/photo-1614179689701-3552a4b2a8f7?w=800",
      ],
      features: [
        "5.2L V10",
        "Quattro AWD",
        "Carbon Fiber",
        "Bang & Olufsen",
        "Sport Exhaust",
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call with dummy data
    const loadCars = () => {
      setTimeout(() => {
        setCars(dummyCars);
        setLoading(false);
      }, 1000);
    };

    loadCars();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30 py-3">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-3">
            <Car className="w-4 h-4 mr-2" />
            انتخاب لوکس
          </Badge>
          <h2 className="text-xl md:text-3xl font-display font-bold mb-4">
            موترهای <span className="gradient-text">ویژه</span>
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
            موترهای لوکس موردعلاقۀ ما را کشف کنید، که به‌دقت برای رانندگان
            خوش‌سلیقه انتخاب شده‌اند.
          </p>
        </motion.div>

        {/* Cars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cars.map((car) => (
            <motion.div
              key={car._id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-primary/90 hover:bg-primary">
                      {car.transmission}
                    </Badge>
                    <Badge variant="secondary" className="bg-background/90">
                      {car.fuelType}
                    </Badge>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4">
                    <Badge className="text-lg px-4 py-2 bg-background/90 text-foreground">
                      {car.pricePerDay}
                      <span className="text-xs text-muted-foreground ml-1">
                        /روز
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-1">{car.name}</h3>
                    <p className="text-muted-foreground">
                      {car.brand} {car.model}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <span className="text-sm font-medium">
                        {car.seats} سیت
                      </span>
                    </div>
                    <div className="text-center">
                      <Gauge className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <span className="text-sm font-medium">
                        {car.mileage || "0"} mi
                      </span>
                    </div>
                    <div className="text-center">
                      <Fuel className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <span className="text-sm font-medium">
                        {car.fuelType}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{car.features.length - 3} بیشتر
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full group py-3 cursor-pointer"
                    onClick={() => navigate(`/cars/${car._id}`)}
                  >
                    مشاهده جزئیات
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="group py-3 cursor-pointer"
            onClick={() => navigate("/cars")}
          >
            مشاهده تمام موتر ها
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCars;
