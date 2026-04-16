import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Input } from '@/components/ui/input';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-r from-primary to-primary opacity-80" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              آماده‌اید که با استایل رانندگی کنید؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              به هزاران مشتری خوشحال بپیوندید که از لوکس بودن ناوگان درجه‌یک ما
              لذت برده‌اند.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              variant="secondary"
              className="group text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 cursor-pointer"
              onClick={() => navigate("/cars")}
            >
              مشاهده موترها
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white/10 cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              تماس با ما
            </Button>
          </motion.div>

          {/* Newsletter Signup
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <p className="text-white/80 mb-4">Subscribe for exclusive offers and updates</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </motion.div> */}

          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+93766303465</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">reservations@carrental.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">24/7 رزرو کردن آنلاین</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
