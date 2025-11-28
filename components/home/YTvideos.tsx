"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Video, X } from "lucide-react";
import { Heading } from "../Heading";
import Background from "../background";
import { TVideoSection, VideoItem } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
type YouTubeVideosSectionProps = {
  data: TVideoSection | undefined;
};
export const YouTubeVideosSection: React.FC<YouTubeVideosSectionProps> = ({
  data,
}) => {
  if (!data) {
    return <Spinner size="lg" />;
  }
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const Videos_Section = data?.data || [];

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
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 text-center">
            <Heading
              title={data?.heading?.title || "🎥 ভিডিও গ্যালারি"}
              subTitle={
                data.heading.subTitle ||
                "আমার ইউটিউব চ্যানেলে প্রকাশিত কিছু ভিডিও"
              }
            />
          </div>
          <span className="lg:block hidden">
            <Link
              href={
                data?.moreVideosUrl ||
                "https://mizanur-rahman-azhari.vercel.app/"
              }
              className="
            flex items-center gap-1 font-medium
            text-blue-600 dark:text-blue-400
            hover:underline
            "
            >
              More
              <ArrowRight
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
            </Link>
          </span>
        </div>
      </div>

      {/* Videos Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-6"
        style={{ perspective: "1000px" }}
      >
        {displayVideos
          ?.slice(0, 8)
          ?.reverse()
          ?.map((video: VideoItem, index: number) => {
            const videoId = video.url.split("v=")[1];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

            return (
              <motion.div
                key={index}
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
      <span className="block lg:hidden">
        <Link
          href={
            data?.moreVideosUrl || "https://mizanur-rahman-azhari.vercel.app/"
          }
          className="
            flex items-center gap-1 font-medium
            text-blue-600 dark:text-blue-400
            hover:underline
            "
        >
          More
          <ArrowRight size={18} className="text-blue-600 dark:text-blue-400" />
        </Link>
      </span>

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
