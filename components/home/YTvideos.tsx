"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Video } from "lucide-react";
import { Heading } from "../Heading";
import Link from "next/link";

interface VideoItem {
  id: string;
  title: string;
  url: string;
}

// Mock data
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "Quran Tafsir - Episode 1",
    url: "https://www.youtube.com/watch?v=LktmvsFdNSA",
  },
  {
    id: "2",
    title: "Hadith Explained",
    url: "https://www.youtube.com/watch?v=08uoMEBwqxw",
  },
  {
    id: "3",
    title: "Islamic Knowledge Series",
    url: "https://www.youtube.com/watch?v=tfEeRkrdoh0",
  },
  {
    id: "4",
    title: "Islamic Knowledge Series",
    url: "https://www.youtube.com/watch?v=otg9tzJsLTk",
  },
  {
    id: "5",
    title: "Quran Tafsir - Episode 2",
    url: "https://www.youtube.com/watch?v=LktmvsFdNSA",
  },
  {
    id: "6",
    title: "Hadith Explained 2",
    url: "https://www.youtube.com/watch?v=08uoMEBwqxw",
  },
  {
    id: "7",
    title: "Islamic Knowledge Series 2",
    url: "https://www.youtube.com/watch?v=tfEeRkrdoh0",
  },
  {
    id: "8",
    title: "Islamic Knowledge Series 3",
    url: "https://www.youtube.com/watch?v=otg9tzJsLTk",
  },
];

export const YouTubeVideosSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

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
  const isMedium = typeof window !== "undefined" && window.innerWidth < 1024;
  const displayVideos = isMobile
    ? MOCK_VIDEOS.slice(0, 5)
    : MOCK_VIDEOS.slice(0, 8);

  return (
    <section
      id="videos"
      className="bg-white px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 py-10 relative overflow-hidden"
    >
      <div className="container mx-auto">
        <Heading
          title="ভিডিও গেলারি"
          subTitle="আমার ইউটিউব চ্যানেলে প্রকাশিত কিছু ভিডিও।"
        />

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayVideos.map((video, index) => {
            const videoId = video.url.split("v=")[1];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div
                  className="hover:scale-105 transition-transform duration-300 shadow-lg rounded-2xl cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() => setActiveVideo(video)}
                >
                  <div className="p-0">
                    <div className="border relative w-full h-40 rounded-2xl overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-black/20 dark:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                        <Video className="w-12 h-12 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* "More Videos" Button */}
        <div className="mt-2 flex justify-center lg:justify-start">
          <Link
            href="https://www.youtube.com/@mizanurrahmanalazhari"
            target="_blank"
            className="bg-gray-100  dark:bg-gray-700 dark:hover:bg-amber-600 text-blue-400 dark:text-white font-semibold py-1 px-6 rounded-full shadow-lg transition-colors"
          >
            More Videos...
          </Link>
        </div>
      </div>

      {/* Modal for iframe */}
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
