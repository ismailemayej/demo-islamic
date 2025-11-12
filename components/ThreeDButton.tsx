"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ThreeDButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const ThreeDButton: React.FC<ThreeDButtonProps> = ({
  children,
  onClick,
  className,
  icon,
  size = "md",
}) => {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 font-semibold rounded-xl text-white shadow-2xl ${sizes[size]} ${className}`}
      whileHover={{
        scale: 1.05,
        rotateX: -5,
        rotateY: 5,
        boxShadow: "0px 15px 25px rgba(0,0,0,0.4)",
      }}
      whileTap={{
        scale: 0.95,
        rotateX: 2,
        rotateY: -2,
        boxShadow: "0px 8px 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500"></div>
      <div className="relative flex items-center gap-2">
        {icon && icon}
        {children}
      </div>
    </motion.button>
  );
};
