"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export const Skeleton2 = ({ className }: SkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={clsx(
        "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
        "dark:from-gray-700 dark:via-gray-800 dark:to-gray-700",
        "rounded-md animate-pulse",
        className
      )}
    ></motion.div>
  );
};
