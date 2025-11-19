"use client";
import { motion } from "framer-motion";
import profile from "@/public/images/profile.png";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import SkeletonPage from "../Skeleton";

export const HeroSection: React.FC = () => {
  const { section, loading, error } = useGetSection("herosection");
  if (loading) return <SkeletonPage />;
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold py-10">
        Error: {error}
      </p>
    );

  return (
    <section
      className="bangla relative py-16 px-4 lg:px-10 rounded-3xl 
      bg-gradient-to-br from-amber-50 via-white to-emerald-50 
      dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 
      overflow-hidden transition-all duration-700"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Image with 3D tilt effect */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
          <motion.div
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            whileHover={{ y: -10, boxShadow: "0px 20px 50px rgba(0,0,0,0.3)" }}
          >
            <img
              src={section?.data?.image || profile.src}
              alt={section?.data?.title || "Hero Image"}
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105 shadow-2xl"
            />
          </motion.div>

          {/* subtle floating animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Right: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 80, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-5"
        >
          <h2 className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide">
            {section?.data?.title || "Hero Title"}
          </h2>

          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight"
            animate={{
              textShadow: [
                "0 0 0px #22c55e",
                "0 0 10px #22c55e",
                "0 0 0px #22c55e",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {section?.data?.subTitle || "Hero Subtitle"}
          </motion.h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {section?.data?.description ||
              "This is the hero section description placeholder."}
          </p>
          <a href="#programs">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-5 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 transition"
            >
              Our Program
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
