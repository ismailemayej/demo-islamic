"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";
import { Trash2, XCircle } from "lucide-react";
import { Input } from "@heroui/input";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

interface VideoItem {
  id: string;
  title: string;
  url: string;
}

interface VideoSectionData {
  heading: { title: string; subTitle: string };
  moreVideosUrl: string;
  data: VideoItem[];
}

export const YouTubeVideosSectionDashboard: React.FC = () => {
  const { section } = useGetSection("youtubevideosection");

  const [formData, setFormData] = useState<VideoSectionData>({
    heading: { title: "", subTitle: "" },
    moreVideosUrl: "",
    data: [],
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (section) {
      setFormData({
        heading: {
          title: section.heading?.title || "",
          subTitle: section.heading?.subTitle || "",
        },
        moreVideosUrl: section.moreVideosUrl || "",
        data: section.data || [],
      });
    }
  }, [section]);
  console.log("MoreVideors ", section);
  const handleChange = (
    sectionType: "heading" | "data" | "moreVideosUrl",
    field: string,
    value: string,
    index?: number
  ) => {
    if (sectionType === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: { ...prev.heading, [field]: value },
      }));
    } else if (sectionType === "moreVideosUrl") {
      setFormData((prev) => ({ ...prev, moreVideosUrl: value }));
    } else if (sectionType === "data" && index !== undefined) {
      const updated = [...formData.data];
      updated[index] = { ...updated[index], [field]: value };
      setFormData((prev) => ({ ...prev, data: updated }));
    }
  };

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [...prev.data, { id: Date.now().toString(), title: "", url: "" }],
    }));
  };

  const handleDelete = (index: number) => {
    setFormData((prev) => {
      const newData = [...prev.data];
      newData.splice(index, 1);
      return { ...prev, data: newData };
    });
  };

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

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/youtubevideosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setEditing(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
            center
          />
          <span className="flex justify-center gap-3">
            <button onClick={handleAdd}>
              <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
            </button>
            <button onClick={() => setEditing(!editing)}>
              {editing ? (
                <XCircle size={25} className="text-yellow-500" />
              ) : (
                <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
              )}
            </button>
          </span>
        </div>

        {/* Edit Panel */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700"
          >
            <span className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-4 text-amber-700 lg:block hidden">
                ✏️ Edit YouTube Videos Section
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="mb-2 flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </span>

            {/* Heading Inputs */}
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-2 mb-3">
              <Input
                size="md"
                type="text"
                label="Section Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700 w-full lg:mb-4"
              />
              <Input
                size="md"
                type="text"
                label="Section Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700 w-full lg:mb-4"
              />
              <Input
                size="md"
                type="text"
                label="More Videos URL"
                value={formData.moreVideosUrl}
                onChange={(e) =>
                  handleChange("moreVideosUrl", "", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700 w-full lg:mb-4"
              />
            </div>

            {/* Videos Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {formData.data.map((video, index) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-gradient-to-r from-amber-50 to-white dark:from-gray-700 dark:to-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-50 z-10 border rounded-full absolute top-2 right-2 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 size={18} className="m-1" />
                  </button>

                  <div className="grid grid-cols-1  gap-3">
                    <Input
                      size="md"
                      type="text"
                      label="Video Title"
                      value={video.title}
                      onChange={(e) =>
                        handleChange("data", "title", e.target.value, index)
                      }
                      className="border p-2 rounded-md dark:bg-gray-700 w-full"
                    />
                    <Input
                      size="md"
                      type="text"
                      label="Video URL"
                      value={video.url}
                      onChange={(e) =>
                        handleChange("data", "url", e.target.value, index)
                      }
                      className="border p-2 rounded-md dark:bg-gray-700 w-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Display Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.data.map((video) => {
            const videoId = video.url.split("v=")[1];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="hover:scale-105 transition-transform duration-300 shadow-lg rounded-2xl cursor-pointer bg-white dark:bg-gray-800"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border">
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black/20 dark:bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                    <span className="text-red-600 text-4xl">▶</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* More Videos Button */}
        {formData.moreVideosUrl && (
          <div className="mt-4 flex justify-center lg:justify-start">
            <a
              href={formData.moreVideosUrl}
              target="_blank"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-amber-600 text-blue-400 dark:text-white font-semibold py-1 px-6 rounded-full shadow-lg transition-colors"
            >
              More Videos...
            </a>
          </div>
        )}

        {/* Video Modal */}
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
      </div>
    </section>
  );
};
