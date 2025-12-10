"use client";
import Image from "next/image";
import image from "@/public/images/profile.png";
import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let req: number;

    const duration = 3000; // 3 seconds to 100%
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const next = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(next);
      if (next < 100) req = requestAnimationFrame(step);
    };

    req = requestAnimationFrame(step);

    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-[9999]">
      <div className="relative flex items-center justify-center">
        {/* Gradient spinning ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-t-transparent border-b-amber-400 border-l-amber-500 border-r-yellow-500 animate-spin"></div>

        <Image
          src={image}
          alt="Logo"
          width={50}
          height={50}
          className="z-10 rounded-full"
        />
      </div>

      <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        {progress}%
      </p>
    </div>
  );
}
