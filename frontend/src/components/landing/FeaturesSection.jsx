import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  CreditCard,
  MapPin,
  Headphones,
  Star,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Shield,
    title: "محافظت ممتاز",
    description: "پوشش کامل بیمه‌ای به همراه هر کرایه برای آرامش خاطر کامل.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "دسترسی ۲۴/۷",
    description:
      "خدمات شبانه‌روزی با زمان‌های انعطاف‌پذیر تحویل و تحویل گرفتن موتر.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CreditCard,
    title: "پرداخت‌های امن",
    description: "گزینه‌های پرداخت متعدد با رمزنگاری امنیتی در سطح بانک.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: MapPin,
    title: "موقعیت‌های مناسب",
    description: "نقاط تحویل متعدد در سراسر شهر، شامل ترمینال‌های هوایی.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Headphones,
    title: "خدمات مهمانداری",
    description: "مهماندار شخصی برای کمک به درخواست‌های ویژه‌ی شما.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Star,
    title: "ناوگان ممتاز",
    description: "مجموعه‌ی برگزیده از بهترین موترهای لوکس.",
    color: "from-yellow-500 to-orange-500",
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="section-padding relative overflow-hidden py-3">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-96 bg-linear-to-t from-purple-500/5 to-transparent" />
      </div>

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-3">
            <Sparkles className="w-4 h-4 mr-2" />
            چرا ما را انتخاب کنید؟
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            تجربه‌ی{" "}
            <span className="gradient-text inline-block">خدمات بی‌نظیر</span>
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
            کار ما فقط کرایه‌ی موتر نیست - ما تجربه‌ای بی‌نظیر و متناسب با
            نیازهای شما را ارائه می‌دهیم.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div
                className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                style={{
                  background: `linear-gradient(135deg, ${feature.color.split(" ")[1]}20, ${feature.color.split(" ")[3]}20)`,
                }}
              />
              <div className="relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} p-4 mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>

                {/* Hover Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
