"use client";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

export default function SkeletonPage() {
  return (
    <section
      className="bangla relative py-16 px-4 lg:px-10 rounded-3xl 
      bg-gradient-to-br from-amber-50 via-white to-emerald-50 
      dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 
      overflow-hidden transition-all duration-700"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Image Skeleton */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative w-full rounded-3xl overflow-hidden"
          >
            <Skeleton
              className="
                w-full 
                max-w-sm 
                sm:max-w-md 
                md:max-w-lg 
                lg:max-w-xl 
                xl:max-w-2xl
                h-[230px]
                sm:h-[300px]
                md:h-[350px]
                lg:h-[420px]
                xl:h-[480px]
                rounded-3xl shadow-2xl
              "
            />
          </motion.div>

          {/* floating effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Right: Text Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
        >
          <Skeleton className="h-7 w-2/3 mx-auto lg:mx-0 rounded-md" />

          <Skeleton className="h-10 sm:h-12 w-3/4 mx-auto lg:mx-0 rounded-md" />

          <Skeleton className="h-4 w-full max-w-lg mx-auto lg:mx-0 rounded-md" />
          <Skeleton className="h-4 w-2/3 mx-auto lg:mx-0 rounded-md" />

          <div className="flex justify-center lg:justify-start mt-4">
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
