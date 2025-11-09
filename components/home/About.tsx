"use client";

import { motion } from "framer-motion";
import profile from "@/public/images/profile.png";
import { Heading } from "../Heading";
import Background from "../background";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { Button } from "@heroui/button";
import Link from "next/link";

export const AboutSection: React.FC = () => {
  const { section, loading, error } = useGetSection("aboutsection");
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <Background id="about">
      {/* Heading */}
      <Heading
        title={section?.heading.title || "About Me"}
        subTitle={section?.heading.subTitle || "About Me"}
      />

      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 mt-10">
        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/3 flex justify-center lg:justify-start"
        >
          <div className=" shadow-lg rounded-3xl overflow-hidden w-64 sm:w-72 md:w-80 border border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <div className="p-0 dark:text-white">
              <img
                src={section?.data?.image || profile.src}
                alt={section?.data?.title || "Profile Image"}
                className="w-full h-auto object-cover "
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-2/3 space-y-4"
        >
          <h1 className="text-3xl text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500 bangla">
            {section?.data?.title || "About Me"}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500 bangla line-clamp-5">
            {section?.data?.description || "About Me"}
          </p>
          <Link href="/about-me">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-full shadow-lg bangla"
            >
              বিস্তারিত দেখুন
            </Button>
          </Link>
        </motion.div>
      </div>
    </Background>
  );
};
