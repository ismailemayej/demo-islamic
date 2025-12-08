"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import profile from "@/public/images/profile.png";
import type { THeroSection } from "@/types/all-types";
import HeroBackground from "../HeroBackground";

interface HeroProps {
  section?: THeroSection;
}

export const HeroSection: React.FC<HeroProps> = ({ section }) => {
  if (!section) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        {/* Simple lightweight Tailwind loader */}
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const subTitle = section?.subTitle ?? "Hero Subtitle";

  return (
    <HeroBackground>
      {/* Optimized Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-60 mix-blend-screen" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-60 mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8 text-left"
          >
            <div className="space-y-4">
              {/* Badge / Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-sans inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md"
              >
                <h2 className="text-sm font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                  {section?.title || "Hero Title"}
                </h2>
              </motion.div>

              {/* Main Heading with Gradient */}
              <h1 className="text-left font-sans line-clamp-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {subTitle}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-left text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-4">
              {section?.description ||
                "This is the hero section description placeholder. Providing distinct, readable text helps the user engage immediately."}
            </p>

            {/* Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pt-2"
            >
              <a href="#books">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="justify-start group relative px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-full shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  <span className="relative z-10 text-left">Our Books</span>
                  {/* Button Shine Effect - hover only */}
                  <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1s_ease-in-out] pointer-events-none" />
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Image Content */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            {/* Decorative Background Blob behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-2xl transform scale-90 lg:translate-x-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative z-10"
            >
              <div className="relative p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl dark:bg-black/10">
                <Image
                  src={section?.image || profile}
                  alt={section?.title || "Hero Image"}
                  width={500}
                  height={500}
                  className="w-full max-w-sm lg:max-w-md h-auto object-cover rounded-xl shadow-lg"
                  priority // ensures this image is LCP
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </HeroBackground>
  );
};
