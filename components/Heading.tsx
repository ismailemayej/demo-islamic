"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HeadingProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  center?: boolean;
  isBangla?: boolean;
  // --- NEW: Prop for Site Title styling ---
  isSiteTitle?: boolean;
  // ----------------------------------------
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  subTitle,
  center = true,
  isBangla = false,
  isSiteTitle = false, // Default to false
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // --- Tilt Effect Handlers ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    // Less rotation for Site Title for subtle effect
    const rotationFactor = isSiteTitle ? 10 : 20;
    const rotateY = (x / width - 0.5) * rotationFactor;
    const rotateX = (0.5 - y / height) * rotationFactor;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // --- Conditional Styling Logic ---
  const fontClasses = isBangla ? "bangla" : "font-sans";

  // Sizes for Site Title vs. Section Heading
  const titleSize = isSiteTitle
    ? "text-5xl sm:text-6xl lg:text-7xl"
    : "text-3xl sm:text-4xl lg:text-5xl";

  // Drop shadow for Site Title vs. Section Heading
  const shadowClass = isSiteTitle
    ? "drop-shadow-[0_6px_6px_rgba(255,191,0,0.6)]" // More pronounced shadow for main title
    : "drop-shadow-[0_3px_3px_rgba(255,191,0,0.3)]";

  // --- Main Render ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`mb-5 ${center ? "text-center" : "text-left"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.h2
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        // The h2 tag is the container for the tilt effect and sets the common font/style
        className={`h-full relative inline-block font-extrabold tracking-tight ${fontClasses} ${titleSize} ${shadowClass} transition-colors duration-500`}
      >
        {/* Inner span applies the gradient and text-clipping */}
        <span
          className={`inline-block text-transparent bg-clip-text font-extrabold
            bg-gradient-to-r from-amber-800 via-yellow-600 to-orange-700
            dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 transition-colors duration-500`}
        >
          {title}
        </span>

        {/* Underline: Only shown for regular section headings (not Site Title) */}
        {!isSiteTitle && (
          <motion.span
            className="absolute left-0 bottom-[-6px] w-full h-[4px] bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-300 dark:to-yellow-200 rounded-full shadow-md transition-colors duration-500"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />
        )}
      </motion.h2>

      {/* Subtitle: Only shown for regular section headings (not Site Title) */}
      {subTitle && !isSiteTitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`${fontClasses} mt-4 text-gray-700 dark:text-amber-200 max-w-3xl mx-auto leading-relaxed text-lg sm:text-lg line-clamp-1 ${
            center ? "text-center" : "text-left"
          } transition-colors duration-500 font-sans`}
        >
          {subTitle}
        </motion.p>
      )}
    </motion.div>
  );
};
