"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, X } from "lucide-react";
import { Heading } from "../Heading";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";

interface VideoItem {
  title: string;
  url: string;
}

export const YouTubeVideosSection: React.FC = () => {
  const { section, loading } = useGetSection("youtubevideosection");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const Videos_Section = section?.data || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1];
    if (!videoId) return "";
    const ampersandPosition = videoId.indexOf("&");
    return `https://www.youtube.com/embed/${
      ampersandPosition !== -1
        ? videoId.substring(0, ampersandPosition)
        : videoId
    }?autoplay=1`;
  };

  // Responsive video limit
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const displayVideos = isMobile
    ? Videos_Section.slice(0, 5)
    : Videos_Section.slice(0, 8);

  return (
    <Background id="youtubevideos">
      <div className="container mx-auto">
        <Heading
          title="🎥 ভিডিও গ্যালারি"
          subTitle="আমার ইউটিউব চ্যানেলে প্রকাশিত কিছু ভিডিও"
        />

        {/* Videos Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-6"
          style={{ perspective: "1000px" }}
        >
          {displayVideos.map((video: VideoItem, index: number) => {
            const videoId = video.url.split("v=")[1];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  rotateY: 10,
                  rotateX: 5,
                  scale: 1.07,
                }}
                className="relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-2xl shadow-xl overflow-hidden transition-transform duration-500"
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 overflow-hidden rounded-2xl">
                  <motion.img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Video className="w-12 h-12 text-red-600 drop-shadow-lg" />
                  </div>
                </div>

                {/* Title */}
                <div className="p-3 text-center">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {video.title}
                  </h3>
                </div>

                {/* Glow Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-transparent"
                  whileHover={{
                    boxShadow:
                      "0 0 25px rgba(34,197,94,0.6), inset 0 0 25px rgba(34,197,94,0.3)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* More Videos Button */}
        <div className="mt-6 flex justify-center">
          <motion.a
            href={
              section?.moreVideosUrl ||
              "https://mizanur-rahman-azhari.vercel.app/"
            }
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Watch More Videos →
          </motion.a>
        </div>
      </div>

      {/* Video Modal with 3D Zoom */}
      {activeVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.6, rotateX: -10 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              className="absolute top-2 right-3 z-50 text-white text-3xl hover:scale-110 transition"
              onClick={() => setActiveVideo(null)}
            >
              <X />
            </button>

            <iframe
              src={getEmbedUrl(activeVideo.url)}
              title={activeVideo.title}
              width="100%"
              height="500"
              className="rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </Background>
  );
};
