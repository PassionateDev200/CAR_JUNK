/** route: src/components/sections/Hero.jsx */
"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  DollarSign,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundSlideshow from "./BackgroundSlideshow";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Generate consistent random positions that don't change on re-renders
  const floatingElements = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      initialX: 100 + ((i * 150) % 800),
      initialY: 100 + ((i * 120) % 600),
      targetX: 200 + ((i * 180) % 900),
      targetY: 150 + ((i * 140) % 700),
    }));
  }, []);

  useEffect(() => {
    setMounted(true);

    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const features = [
    { icon: <DollarSign className="w-5 h-5" />, text: "Top Dollar Guaranteed" },
    { icon: <Zap className="w-5 h-5" />, text: "Instant Quotes" },
    { icon: <Clock className="w-5 h-5" />, text: "Free Pickup" },
    { icon: <Shield className="w-5 h-5" />, text: "Cash on Spot" },
  ];

  const heroImages = [
    "/images/hero0.webp",
    "/images/hero1.webp",
    "/images/hero2.webp",
    "/images/hero3.webp",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <BackgroundSlideshow images={heroImages} />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />

      {/* Dynamic Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-orange-900/30 z-20"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59,130,246,0.3) 0%, transparent 50%, rgba(251,146,60,0.3) 100%)",
            "linear-gradient(135deg, rgba(251,146,60,0.3) 0%, transparent 50%, rgba(59,130,246,0.3) 100%)",
            "linear-gradient(225deg, rgba(59,130,246,0.3) 0%, transparent 50%, rgba(251,146,60,0.3) 100%)",
            "linear-gradient(315deg, rgba(251,146,60,0.3) 0%, transparent 50%, rgba(59,130,246,0.3) 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Elements - Fixed to prevent hydration issues */}
      {mounted && (
        <div className="absolute inset-0 z-30">
          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.min(element.initialX, windowSize.width - 50),
                y: Math.min(element.initialY, windowSize.height - 50),
              }}
              animate={{
                x: Math.min(element.targetX, windowSize.width - 50),
                y: Math.min(element.targetY, windowSize.height - 50),
              }}
              transition={{
                duration: 10 + element.id * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-40 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl mb-8 hover:shadow-orange-500/25 transition-all duration-300"
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-current text-yellow-300"
                />
              ))}
            </div>
            <span className="font-bold text-sm tracking-wide">
              Rated #1 Car Buying Service
            </span>
          </motion.div>

          {/* Main Heading with Text Effects */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Get </span>
            <motion.span
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Cash
            </motion.span>
            <span className="text-white"> for Your</span>
            <br />
            <motion.span
              className="text-white relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Junk Car{" "}
              <motion.span
                className="text-green-400"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(74, 222, 128, 0.5)",
                    "0 0 40px rgba(74, 222, 128, 0.8)",
                    "0 0 20px rgba(74, 222, 128, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Today
              </motion.span>
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Instant quotes, free pickup, and cash on the spot. Turn your old
            vehicle into money in just a few clicks.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-xl hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-orange-400">{feature.icon}</span>
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-8 py-6 text-lg font-bold rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/quote">
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Get Instant Quote
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl transition-all duration-300"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-gray-300 mb-6 text-lg">
              Trusted by thousands of customers
            </p>
            <div className="flex justify-center items-center gap-8 md:gap-16">
              <motion.div
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  10K+
                </div>
                <div className="text-gray-400 text-sm">Cars Purchased</div>
              </motion.div>
              <motion.div
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-green-400 transition-colors">
                  $2M+
                </div>
                <div className="text-gray-400 text-sm">Paid Out</div>
              </motion.div>
              <motion.div
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  4.9★
                </div>
                <div className="text-gray-400 text-sm">Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
