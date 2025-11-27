"use client";
import { motion } from "framer-motion";
import profile from "@/public/images/profile.png";
import Background from "../background";
import type { THeroSection } from "@/types/all-types";
import HeroBackground from "../HeroBackground";

interface HeroProps {
  section?: THeroSection;
}

export const HeroSection: React.FC<HeroProps> = ({ section }) => {
  return (
    <HeroBackground>
      <div
        className="
          absolute inset-0 z-0
          bg-[radial-gradient(circle_at_10%_20%,rgba(16,88,56,0.15)_1px,transparent_1px),radial-gradient(circle_at_80%_80%,rgba(16,88,56,0.15)_1px,transparent_1px)]
          [background-size:40px_40px]
          opacity-30 dark:opacity-20
        "
      ></div>

      <div className="relative z-10 mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mt-4">
        {/* Left: Image */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
          <motion.div className="relative w-full max-w-md overflow-hidden lg:ml-20">
            <img
              src={section?.image || profile.src}
              alt={section?.title || "Hero Image"}
              className="w-full lg:h-96 h-auto object-cover transition-transform duration-500 hover:scale-105 shadow-2xl rounded-xl"
            />
          </motion.div>
        </div>

        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 80, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-5"
        >
          <h2 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide">
            {section?.title || "Hero Title"}
          </h2>

          <motion.h1
            className="text-5xl sm:text-6xl 
             bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400
             bg-clip-text text-transparent"
            transition={{ duration: 3, repeat: Infinity }}
          >
            {section?.subTitle || "Hero Subtitle"}
          </motion.h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {section?.description ||
              "This is the hero section description placeholder."}
          </p>

          <a href="#books">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-5 px-6 py-3 bg-green-900 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 transition"
            >
              Our Books
            </motion.button>
          </a>
        </motion.div>
      </div>
    </HeroBackground>
  );
};
