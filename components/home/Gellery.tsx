"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

export const GallerySection: React.FC = () => {
  const { section, loading, error } = useGetSection("gallerysection");
  const galleryData = section;
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <section
      id="gallery"
      className="py-24 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-0">
        <Heading
          title={section?.heading?.title || " প্রতিষ্ঠানের গ্যালারি "}
          subTitle={
            section?.heading?.subTitle ||
            " আমাদের প্রতিষ্ঠানের বিভিন্ন মুহূর্তের ছবি সমূহ "
          }
        />
        <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
          {galleryData?.data?.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-xl group shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-700 ${
                i === 0 || i === 1 || i === 5 || i === 2 ? "lg:col-span-2" : ""
              } ${i === 2 ? "lg:row-span-2" : ""}`}
            >
              <img
                src={item.image}
                alt={item.title || "Gallery Image"}
                className="w-full h-full object-cover transform duration-300 group-hover:scale-105"
              />

              {/* Overlay caption */}
              {item.title && (
                <div className="absolute bottom-2 left-2 bg-amber-600/80 dark:bg-amber-500/80 text-white dark:text-gray-900 text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
                  {item.title}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
