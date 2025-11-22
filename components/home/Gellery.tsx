"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "../Heading";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";
import Loader from "../loader";

export const GallerySection: React.FC = () => {
  const { section, loading } = useGetSection("gallerysection");
  const galleryData = section;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (loading) {
    return <Loader />;
  }

  return (
    <Background id="gallery">
      <Heading
        title={section?.heading?.title || "প্রতিষ্ঠানের গ্যালারি"}
        subTitle={
          section?.heading?.subTitle ||
          "আমাদের প্রতিষ্ঠানের বিভিন্ন মুহূর্তের ছবি সমূহ"
        }
      />
      <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
        {galleryData?.data?.map((item: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              scale: 1.05,
              rotateX: 5,
              rotateY: -5,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            style={{ perspective: 1000 }}
            className={`relative overflow-hidden rounded-xl group shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-700 ${
              i === 0 || i === 1 || i === 5 || i === 2 ? "lg:col-span-2" : ""
            } ${i === 2 ? "lg:row-span-2" : ""}`}
            onClick={() => setSelectedImage(item.image)}
          >
            <img
              src={item.image}
              alt={item.title || "Gallery Image"}
              className="w-full h-full object-cover transform duration-300 group-hover:scale-105 cursor-pointer"
            />

            {item.title && (
              <div className="absolute bottom-2 left-2 bg-amber-600/80 dark:bg-amber-500/80 text-white dark:text-gray-900 text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
                {item.title}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal for zoomed image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Zoomed Image"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
};
