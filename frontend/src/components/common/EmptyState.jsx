import { motion } from "motion/react";
import { Car, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyState = ({
  title = "No cars found",
  description = "Try adjusting your filters or search criteria",
  icon: IconComponent,
  icon = "car",
  action,
  secondaryAction,
}) => {
  const icons = {
    car: Car,
    search: Search,
    filter: Filter,
  };

  const Icon = IconComponent || icons[icon] || Car;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      <div className="flex gap-3 justify-center">
        {action && (
          <Button onClick={action.onClick} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
