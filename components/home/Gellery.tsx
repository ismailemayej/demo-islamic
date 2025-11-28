"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { TPhotoSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";
type GallerySectionProps = {
  section: TPhotoSection | null | undefined;
};
export const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  if (!section) {
    return <Spinner size="lg" />;
  }
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"; // স্ক্রল বন্ধ
    } else {
      document.body.style.overflow = "auto"; // স্ক্রল চালু
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  return (
    <Background id="gallery">
      <Heading
        title={section?.heading?.title || " Accademy:ের গ্যালারি"}
        subTitle={
          section?.heading?.subTitle ||
          "আমাদের  Accademy:ের বিভিন্ন মুহূর্তের ছবি সমূহ"
        }
      />
      <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
        {section?.data
          ?.slice(0, 6)
          ?.reverse()
          ?.map((item: any, i: number) => (
            <motion.div
              key={i}
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

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage}
              alt="Zoomed Image"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
};
