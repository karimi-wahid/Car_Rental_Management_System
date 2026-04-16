import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Key,
  Car,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Search,
    title: "مرور کنید و انتخاب کنید",
    description:
      "ناوگان ممتاز ما را مشاهده کنید و موتر مناسب برای نیازهایتان را انتخاب نمایید.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "تاریخ‌ها را انتخاب کنید",
    description:
      "تاریخ تحویل و تحویل گرفتن موتر خود را با سیستم رزرو انعطاف‌پذیر ما انتخاب کنید.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CreditCard,
    title: "رزرو امن",
    description: "رزرو خود را با پروسه‌ی پرداخت امن ما تکمیل کنید.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Key,
    title: "تحویل بگیرید و برانید",
    description:
      "کلیدهای خود را دریافت کنید و از یک تجربه‌ی رانندگی فراموش‌نشدنی لذت ببرید.",
    color: "from-orange-500 to-red-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding py-3">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-3">
            <CheckCircle className="w-4 h-4 mr-2" />
            پروسه‌ ساده
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            چگونه <span className="gradient-text">کار می‌کند</span>
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
            تنها در چهار مرحله‌ی ساده پشت فرمان موتر آرزوهایتان بنشینید.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-primary/20 via-primary to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm z-10">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="text-center pt-8">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-linear-to-br ${step.color} p-5 mx-auto mb-6`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[40%] -left-4 transform -translate-y-1/2">
                    <Car className="w-6 h-6 text-primary rotate-180" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
