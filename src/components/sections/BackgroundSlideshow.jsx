/** route: src/components/sections/BackgroundSlideshow.jsx */
"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const BackgroundSlideshow = ({
  images = [],
  interval = 6000,
  transitionDuration = 2000,
  enableKenBurns = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ken Burns effect configurations
  const kenBurnsEffects = [
    { scale: [1, 1.1], x: [0, -50], y: [0, -30] },
    { scale: [1.1, 1], x: [-30, 0], y: [-20, 0] },
    { scale: [1, 1.15], x: [0, 30], y: [0, -40] },
    { scale: [1.1, 1.05], x: [20, 0], y: [30, 0] },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning || !mounted) return;

    setIsTransitioning(true);
    const newCurrentIndex = (currentIndex + 1) % images.length;
    const newNextIndex = (newCurrentIndex + 1) % images.length;

    setTimeout(() => {
      setCurrentIndex(newCurrentIndex);
      setNextIndex(newNextIndex);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  }, [
    currentIndex,
    images.length,
    isTransitioning,
    transitionDuration,
    mounted,
  ]);

  useEffect(() => {
    if (images.length <= 1 || !mounted) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, images.length, mounted]);

  useEffect(() => {
    // Preload next image only on client side
    if (mounted && images[nextIndex]) {
      const img = new window.Image();
      img.src = images[nextIndex];
    }
  }, [nextIndex, images, mounted]);

  if (!images.length || !mounted) {
    return (
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {/* Current Image */}
        <motion.div
          key={`current-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: transitionDuration / 1000 },
          }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={
              enableKenBurns
                ? kenBurnsEffects[currentIndex % kenBurnsEffects.length]
                : {}
            }
            animate={
              enableKenBurns
                ? {
                    scale:
                      kenBurnsEffects[currentIndex % kenBurnsEffects.length]
                        .scale[1],
                    x: kenBurnsEffects[currentIndex % kenBurnsEffects.length]
                      .x[1],
                    y: kenBurnsEffects[currentIndex % kenBurnsEffects.length]
                      .y[1],
                  }
                : {}
            }
            transition={{
              duration: interval / 1000,
              ease: "easeInOut",
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`Hero background ${currentIndex + 1}`}
              fill
              className="object-cover object-center"
              priority={currentIndex === 0}
              quality={90}
              sizes="100vw"
              onError={(e) => {
                console.warn(`Failed to load image: ${images[currentIndex]}`);
              }}
            />
          </motion.div>
        </motion.div>

        {/* Next Image (for smooth transition) */}
        {isTransitioning && (
          <motion.div
            key={`next-${nextIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: transitionDuration / 1000 },
            }}
          >
            <motion.div
              className="w-full h-full relative"
              initial={
                enableKenBurns
                  ? {
                      scale:
                        kenBurnsEffects[nextIndex % kenBurnsEffects.length]
                          .scale[0],
                      x: kenBurnsEffects[nextIndex % kenBurnsEffects.length]
                        .x[0],
                      y: kenBurnsEffects[nextIndex % kenBurnsEffects.length]
                        .y[0],
                    }
                  : {}
              }
            >
              <Image
                src={images[nextIndex]}
                alt={`Hero background ${nextIndex + 1}`}
                fill
                className="object-cover object-center"
                quality={90}
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional: Slideshow Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => {
              if (!isTransitioning && mounted) {
                setCurrentIndex(index);
                setNextIndex((index + 1) % images.length);
              }
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlideshow;
