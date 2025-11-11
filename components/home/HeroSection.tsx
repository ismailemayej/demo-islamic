"use client";
import { motion } from "framer-motion";

import profile from "@/public/images/profile.png";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import SkeletonPage from "../Skeleton";

export const HeroSection: React.FC = () => {
  const { section, loading, error } = useGetSection<any>("herosection");

  if (loading) return <SkeletonPage />;

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold py-10">
        Error: {error}
      </p>
    );

  return (
    <section className="bangla relative py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-start"
        >
          <div className="relative w-full max-w-md shadow-lg rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <img
              src={section?.data?.image || profile.src}
              alt={section?.data?.title || "Hero Image"}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-4"
        >
          <h2 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400 transition-colors duration-500">
            {section?.data?.title || "Hero Title"}
          </h2>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight transition-colors duration-500">
            {section?.data?.subTitle || "Hero Subtitle"}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">
            {section?.data?.description ||
              "This is the hero section description placeholder."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
