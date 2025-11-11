"use client";

import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

export default function SkeletonPage() {
  return (
    <section
      className="bangla relative overflow-hidden py-10 px-3 rounded-xl 
        bg-gradient-to-b from-amber-50 to-white 
        dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex justify-center"
          >
            <Skeleton
              className="
                w-full 
                max-w-[300px] 
                sm:max-w-[400px] 
                md:max-w-[450px] 
                lg:max-w-[500px] 
                h-[250px] 
                sm:h-[320px] 
                md:h-[360px] 
                lg:h-[400px] 
                rounded-3xl 
                shadow-lg
              "
            />
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <Skeleton className="h-6 sm:h-7 md:h-8 w-3/4 mx-auto lg:mx-0 rounded-md" />
            <Skeleton className="h-8 sm:h-10 w-5/6 mx-auto lg:mx-0 rounded-md" />
            <Skeleton className="h-3 sm:h-4 w-full max-w-md mx-auto lg:mx-0 rounded-md" />
            <Skeleton className="h-3 sm:h-4 w-2/3 mx-auto lg:mx-0 rounded-md" />

            <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap mt-4">
              <Skeleton className="h-10 sm:h-12 w-32 sm:w-40 rounded-full" />
              <Skeleton className="h-10 sm:h-12 w-32 sm:w-40 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
