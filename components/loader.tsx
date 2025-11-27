"use client";
import image from "@/public/images/profile.png";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-[9999]">
      {/* Image + Ring */}
      <div className="relative flex items-center justify-center">
        <div className="loader-ring"></div>
        <Image
          src={image.src}
          alt="Logo"
          width={50}
          height={50}
          className="z-[5] rounded-full"
        />
      </div>

      {/* Percentage Text */}
      <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        {progress}%
      </p>
    </div>
  );
}
