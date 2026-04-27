import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import useCarStore from "@/store/carStore";

export const RelatedCars = ({ currentCarId }) => {
  const { cars, fetchCars } = useCarStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      try {
        await fetchCars();
      } catch (error) {
        console.error("بارگذاری موترهای مشابه ناموفق بود:", error);
      }
    };

    loadCars();
  }, [currentCarId, fetchCars]);

  return (
    <div className="mt-16" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-right">
          موترهای مشابه که ممکن است بپسندید
        </h2>
        <Button
          variant="ghost"
          className="group"
          onClick={() => navigate("/cars")}
        >
          مشاهده همه
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <motion.div
            key={car._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card
              className="cursor-pointer overflow-hidden"
              onClick={() => navigate(`/cars/${car._id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.images[0].url}
                  alt={car.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <Badge>
                    {formatCurrency(car.pricePerDay)}
                    <span className="mr-1 text-xs">/ روز</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 text-right">{car.name}</h3>
                <p className="text-sm text-muted-foreground text-right">
                  {car.brand} {car.carModel} • {car.year}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
