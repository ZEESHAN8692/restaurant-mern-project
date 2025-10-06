import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";

const images = [
  "/slider/s1.jpg", // Replace with your image
 "/slider/s2.jpg", 
 "/slider/s1.jpg", 
 
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Food"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Top Contact Bar */}
      <div className="absolute top-0 w-full text-white text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 sm:px-6 py-2 bg-black/60">
        <div className="text-center sm:text-left">
          Phone no: +91 88253 74128 | email: info7-eleven@gmail.com
        </div>
        <div className="text-center sm:text-right">
          Mon - Fri / 9:00-21:00, Sat - Sun / 10:00-20:00
        </div>
      </div>


      {/* Slider dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === currentIndex ? "bg-yellow-400" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
