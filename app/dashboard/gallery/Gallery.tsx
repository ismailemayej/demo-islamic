"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";

// Gallery Data
const galleryData = {
  data: [
    {
      id: "1",
      image:
        "https://img.freepik.com/free-photo/modern-interior-living-room-with-comfortable-furniture_1150-14584.jpg",
      title: "Main Hall",
    },
    {
      id: "2",
      image:
        "https://img.freepik.com/free-photo/modern-library-with-bookshelves_1150-14585.jpg",
      title: "Library",
    },
    {
      id: "3",
      image:
        "https://img.freepik.com/free-photo/spacious-prayer-room-with-mosque-interior_1150-14586.jpg",
      title: "Prayer Room",
    },
    {
      id: "4",
      image:
        "https://img.freepik.com/free-photo/beautiful-courtyard-with-garden_1150-14587.jpg",
      title: "Courtyard",
    },
    {
      id: "5",
      image:
        "https://img.freepik.com/free-photo/modern-classroom-with-desks-and-chairs_1150-14588.jpg",
      title: "Classroom",
    },
    {
      id: "6",
      image:
        "https://img.freepik.com/free-photo/beautiful-garden-area-with-plants_1150-14589.jpg",
      title: "Garden Area",
    },
  ],
};

export const GallerySectionDashboard: React.FC = () => {
  return (
    <section
      id="gallery"
      className="py-24 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-0">
        <Heading
          title=" প্রতিষ্ঠানের গ্যালারি "
          subTitle=" আমাদের প্রতিষ্ঠানের বিভিন্ন মুহূর্তের ছবি সমূহ "
        />

        <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
          {galleryData?.data?.map((item, i) => (
            <motion.div
              key={item.id}
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
