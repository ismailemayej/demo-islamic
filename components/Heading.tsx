"use client";

import { motion } from "framer-motion";

interface HeadingProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  center?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  subTitle,
  center = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`mb-5 ${center ? "text-center" : "text-left"}`}
    >
      {/* Animated Title */}
      <motion.h2
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 280 }}
        className="h-full relative inline-block bangla font-extrabold 
          text-3xl sm:text-3xl lg:text-5xl 
          bg-clip-text text-transparent font-serif tracking-tight drop-shadow-[0_3px_3px_rgba(255,191,0,0.3)]
          bg-gradient-to-r from-amber-800 via-yellow-600 to-orange-700
          dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 transition-colors duration-500"
      >
        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400">
          {title}
        </span>

        {/* Animated underline */}
        <motion.span
          className="absolute left-0 bottom-[-6px] w-full h-[4px] bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-300 dark:to-yellow-200 rounded-full shadow-md transition-colors duration-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </motion.h2>

      {/* Subtitle animation */}
      {subTitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`bangla mt-4 text-gray-700 dark:text-amber-200 max-w-3xl mx-auto leading-relaxed text-lg sm:text-lg ${
            center ? "text-center" : "text-left"
          } transition-colors duration-500`}
        >
          {subTitle}
        </motion.p>
      )}
    </motion.div>
  );
};
