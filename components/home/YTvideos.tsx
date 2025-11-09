"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { Heading } from "../Heading";
import Link from "next/link";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

interface VideoItem {
  title: string;
  url: string;
}

export const YouTubeVideosSection: React.FC = () => {
  const { section } = useGetSection<any>("youtubevideosection");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [displayVideos, setDisplayVideos] = useState<VideoItem[]>([]);

  // ✅ Safe video extraction
  const videos: VideoItem[] = section?.data || [];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateVideos = () => {
      if (window.innerWidth < 640) setDisplayVideos(videos.slice(0, 4));
      else if (window.innerWidth < 1024) setDisplayVideos(videos.slice(0, 6));
      else setDisplayVideos(videos.slice(0, 8));
    };

    updateVideos();
    window.addEventListener("resize", updateVideos);
    return () => window.removeEventListener("resize", updateVideos);
  }, [videos]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const videoIdMatch = url.match(/(?:v=|be\/)([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : "";
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
  };

  return (
    <section
      id="videos"
      className="bg-white px-3 rounded-xl 
                 bg-gradient-to-b from-amber-50 to-white 
                 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 py-10 relative overflow-hidden"
    >
      <div className="container mx-auto">
        <Heading
          title={section?.heading?.title || "ভিডিও গ্যালারি"}
          subTitle={
            section?.heading?.subTitle ||
            "আমার ইউটিউব চ্যানেলে প্রকাশিত কিছু ভিডিও।"
          }
        />

        {displayVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayVideos.map((video, index) => {
              const videoIdMatch = video.url.match(/(?:v=|be\/)([^&]+)/);
              const videoId = videoIdMatch ? videoIdMatch[1] : "";
              const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className="hover:scale-105 transition-transform duration-300 shadow-lg rounded-2xl cursor-pointer bg-white dark:bg-gray-800"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 dark:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                        <Video className="w-12 h-12 text-red-600" />
                      </div>
                    </div>
                    <p className="text-center py-2 font-medium dark:text-gray-200 text-gray-800">
                      {video.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 mt-6">
            🎥 কোনো ভিডিও পাওয়া যায়নি
          </p>
        )}

        {/* More Videos */}
        {videos.length > 0 && (
          <div className="mt-4 flex justify-center lg:justify-start">
            <Link
              href={section?.data?.moreVideosUrl || "https://www.youtube.com"}
              target="_blank"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-amber-600 text-blue-500 dark:text-white font-semibold py-1 px-6 rounded-full shadow-lg transition-colors"
            >
              More Videos...
            </Link>
          </div>
        )}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/90 p-4">
          <div className="relative w-full max-w-4xl bg-black dark:bg-gray-900 rounded-xl shadow-xl">
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold z-50"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>

            <div className="w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
