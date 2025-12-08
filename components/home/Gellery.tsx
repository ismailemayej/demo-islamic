"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
    document.body.style.overflow = selectedImage ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  return (
    <Background id="gallery">
      <Heading
        title={section?.heading?.title || "Accademy"}
        subTitle={
          section?.heading?.subTitle || "Accademy Gallery Showcase Your Work"
        }
      />

      <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
        {section?.data
          ?.slice(0, 6)
          ?.reverse()
          ?.map((item: any, i: number) => (
            <motion.div
              key={item.id || i}
              className={`relative overflow-hidden rounded-xl group shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-700 
              ${i === 0 || i === 1 || i === 5 || i === 2 ? "lg:col-span-2" : ""}
              ${i === 2 ? "lg:row-span-2" : ""}`}
              onClick={() => setSelectedImage(item.image)}
            >
              <Image
                src={item.image}
                alt={item.title || "Gallery Image"}
                fill
                className="object-cover transform duration-300 group-hover:scale-105 cursor-pointer"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={i < 2} // প্রথম 2 image fast load
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Zoomed Image"
                fill
                className="object-contain rounded-xl shadow-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
};
