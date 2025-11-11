"use client";

import { motion } from "framer-motion";
import { BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import profile from "@/public/images/profile.png";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Link from "next/link";
import SkeletonPage from "../Skeleton";
export const HeroSection: React.FC = () => {
  const { section, loading, error } = useGetSection("herosection");
  // 🧩 Loading Skeleton (Responsive)
  if (loading) {
    return <SkeletonPage />;
  }

  // 🧩 Error Case
  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        Error loading hero section
      </p>
    );
  }

  // 🧩 Actual Hero Section
  return (
    <section
      id="hero"
      className="bangla relative overflow-hidden py-10 px-3 rounded-xl 
        bg-gradient-to-b from-amber-50 to-white 
        dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-start"
        >
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]">
            <img
              src={section?.data?.image || profile.src}
              alt="মাওলানা মোঃ ইসমাইল হোসাইন"
              className="w-full h-auto object-cover rounded-3xl shadow-2xl transition-all duration-500"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 90%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-4"
        >
          <h2 className="bangla font-semibold text-2xl sm:text-3xl lg:text-4xl text-emerald-700 dark:text-emerald-400">
            {section?.data?.title || ""}
          </h2>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
            {section?.data?.subTitle || ""}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-md sm:max-w-lg mx-auto lg:mx-0">
            {section?.data?.description || ""}
          </p>

          <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap mt-4">
            <Link href="#videos">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-full shadow-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                বক্তৃতা দেখুন
              </Button>
            </Link>

            <Link href="#contact">
              <Button
                size="lg"
                className="border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                যোগাযোগ করুন
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
