import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Premium Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-4">
            <Badge
              variant="secondary"
              className="px-4 py-3 text-sm bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              تجربه کرایه موترهای درجه یک
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-xl md:text-3xl lg:text-5xl font-display font-bold tracking-tight"
          >
            <span className="">با ماشین رویاهایت رانندگی کن</span>
            <br />
            <span className="">با شکوه و سبک خاص</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            اوج برتری موتر را تجربه کنید. از مجموعه برگزیده موترهای لوکس ما
            انتخاب کنید، هر یک آسایش و عملکردی بی‌نظیر ارائه می‌دهند.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="group text-lg px-8 py-6 cursor-pointer"
              onClick={() => navigate("/cars")}
            >
              مشاهده موترها
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 hover:text-white hover:bg-[#b11226] transition-colors duration-300 cursor-pointer"
              onClick={() => navigate("/about")}
            >
              بیشتر بدانید
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "500+", label: "موتر های زیبا", icon: Shield },
              { value: "24/7", label: "خدمات مشتریان", icon: Clock },
              { value: "98%", label: "مشتریان راضی", icon: Sparkles },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 " />
                </div>
                <div className="text-3xl font-bold ">{stat.value}</div>
                <div className="text-sm ">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
