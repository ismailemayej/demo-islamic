"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Video, X } from "lucide-react";
import { Heading } from "../Heading";
import Background from "../background";
import { TVideoSection, VideoItem } from "@/types/all-types";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";

type YouTubeVideosSectionProps = {
  data: TVideoSection | undefined;
};

export const YouTubeVideosSection: React.FC<YouTubeVideosSectionProps> = ({
  data,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Responsive detection for mobile
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const Videos_Section = data?.data || [];

  const displayVideos = isMobile
    ? Videos_Section.slice(-5).reverse()
    : Videos_Section.slice(-8).reverse();

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

  return (
    <Background id="youtubevideos">
      {/* Heading */}
      <div className="flex justify-between items-center w-full">
        <span className="flex-1 text-center">
          <Heading
            title={data?.heading?.title || "🎥 ভিডিও গ্যালারি"}
            subTitle={
              data?.heading?.subTitle ||
              "আমার ইউটিউব চ্যানেলে প্রকাশিত কিছু ভিডিও"
            }
          />
        </span>
        <span className="lg:block hidden">
          <Link
            href={
              data?.moreVideosUrl || "https://mizanur-rahman-azhari.vercel.app/"
            }
            className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            More
            <ArrowRight size={18} />
          </Link>
        </span>
      </div>

      {/* Videos Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-6"
        style={{ perspective: "1000px" }}
      >
        {displayVideos.map((video, index) => {
          const videoId = video.url.split("v=")[1];
          const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

          return (
            <motion.div
              key={video.url + index} // unique key
              className="relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300"
              onClick={() => setActiveVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative w-full h-44 overflow-hidden rounded-2xl">
                <motion.img
                  src={thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy" // lazy load for optimization
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
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
                    "0 0 20px rgba(34,197,94,0.5), inset 0 0 20px rgba(34,197,94,0.25)",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* More Videos Button (Mobile) */}
      <span className="block lg:hidden text-center mb-6">
        <Link
          href={
            data?.moreVideosUrl || "https://mizanur-rahman-azhari.vercel.app/"
          }
          className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline justify-center"
        >
          More
          <ArrowRight size={18} />
        </Link>
      </span>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
              <button
                className="absolute top-2 right-3 z-50 text-white text-3xl hover:scale-110 transition-transform"
                onClick={() => setActiveVideo(null)}
                aria-label="Close Video"
              >
                <X />
              </button>

              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                width="100%"
                height="500"
                className="rounded-2xl"
                loading="lazy" // lazy load iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
};
