"use client";

import { useState } from "react";
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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateY = (x / width - 0.5) * 20; // -10 to 10 degree
    const rotateX = (0.5 - y / height) * 20; // -10 to 10 degree
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

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
        className="h-full relative inline-block bangla font-extrabold 
          text-3xl sm:text-3xl lg:text-5xl 
          bg-clip-text text-transparent font-serif tracking-tight drop-shadow-[0_3px_3px_rgba(255,191,0,0.3)]
          bg-gradient-to-r from-amber-800 via-yellow-600 to-orange-700
          dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 transition-colors duration-500"
      >
        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400">
          {title}
        </span>
        <motion.span
          className="absolute left-0 bottom-[-6px] w-full h-[4px] bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-300 dark:to-yellow-200 rounded-full shadow-md transition-colors duration-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </motion.h2>

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
