"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";
import { Trash2 } from "lucide-react";
import { Input } from "@heroui/input";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { OpenModal } from "@/components/Modal";

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

  const [saving, setSaving] = useState(false);

  // Modal States
  const [openHeadingModal, setOpenHeadingModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Active editing video
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

  // 🔹 Add new video
  const handleAddVideo = () => {
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: "",
      url: "",
    };
    setFormData((prev) => ({
      ...prev,
      data: [...prev.data, newVideo],
    }));
    setActiveVideo(newVideo);
    setOpenAddModal(true);
  };

  // 🔹 Delete video
  const handleDeleteVideo = async (id: string) => {
    const updated = formData.data.filter((v) => v.id !== id);
    setFormData((prev) => ({ ...prev, data: updated }));

    setSaving(true);
    toast.loading("Deleting...", { id: "delete" });
    try {
      const res = await fetch("/api/all-data/youtubevideosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, data: updated }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");

      toast.dismiss("delete");
      toast.success("Deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Update video (edit or add)
  const handleUpdateVideo = async () => {
    if (!activeVideo) return;

    // Validation
    if (!activeVideo.title.trim()) {
      toast.error("Video title is required!");
      return;
    }
    if (!activeVideo.url.trim()) {
      toast.error("Video URL is required!");
      return;
    }

    setSaving(true);
    toast.loading("Saving...", { id: "save" });
    try {
      const updatedData = formData.data.map((v) =>
        v.id === activeVideo.id ? activeVideo : v
      );

      const res = await fetch("/api/all-data/youtubevideosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, data: updatedData }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");

      toast.dismiss("save");
      toast.success("Saved successfully!");
      setOpenAddModal(false);
      setOpenEditModal(false);
      setActiveVideo(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };
  const handleUpdateHeading = async () => {
    setSaving(true);
    toast.loading("Saving...", { id: "save-heading" });

    try {
      const res = await fetch("/api/all-data/youtubevideosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");

      toast.dismiss("save-heading");
      toast.success("Heading updated successfully!");
      setOpenHeadingModal(false);
    } catch (err: any) {
      toast.dismiss("save-heading");
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-10 px-3">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 text-center">
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
              center
            />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleAddVideo}>
              <IoAddCircleSharp className="text-green-500 w-7 h-7" />
            </button>

            <button onClick={() => setOpenHeadingModal(true)}>
              <FaRegEdit className="text-yellow-500 w-7 h-6" />
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.data?.reverse()?.map((video) => {
            const vid = video.url.split("v=")[1];
            const thumb = vid ? `https://img.youtube.com/vi/${vid}/0.jpg` : "";

            return (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Edit Btn */}
                <button
                  onClick={() => {
                    setActiveVideo(video);
                    setOpenEditModal(true);
                  }}
                  className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 rounded-full p-1"
                >
                  <FaRegEdit size={16} />
                </button>

                {/* Delete Btn */}
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1"
                >
                  <Trash2 size={16} />
                </button>

                {/* Thumbnail */}
                {thumb && (
                  <img
                    src={thumb}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-3 text-sm dark:text-white">
                  <p className="font-semibold">{video.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Heading Modal */}
      <OpenModal
        title="Edit Heading"
        isOpen={openHeadingModal}
        onClose={() => setOpenHeadingModal(false)}
        size="lg"
      >
        <Input
          label="Section Title"
          value={formData.heading.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              heading: { ...prev.heading, title: e.target.value },
            }))
          }
        />
        <Input
          label="Section Subtitle"
          value={formData.heading.subTitle}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              heading: { ...prev.heading, subTitle: e.target.value },
            }))
          }
        />
        <Input
          label="More Videos URL"
          value={formData.moreVideosUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, moreVideosUrl: e.target.value }))
          }
        />

        <button
          onClick={handleUpdateHeading}
          className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </OpenModal>

      {/* Add Video Modal */}
      <OpenModal
        title="Add New Video"
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
      >
        {activeVideo && (
          <>
            <Input
              label="Video Title"
              value={activeVideo.title}
              onChange={(e) =>
                setActiveVideo({ ...activeVideo, title: e.target.value })
              }
            />
            <Input
              label="Video URL"
              value={activeVideo.url}
              onChange={(e) =>
                setActiveVideo({ ...activeVideo, url: e.target.value })
              }
            />

            <button
              onClick={handleUpdateVideo}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </OpenModal>

      {/* Edit Video Modal */}
      <OpenModal
        title="Edit Video"
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      >
        {activeVideo && (
          <>
            <Input
              label="Video Title"
              value={activeVideo.title}
              onChange={(e) =>
                setActiveVideo({ ...activeVideo, title: e.target.value })
              }
            />
            <Input
              label="Video URL"
              value={activeVideo.url}
              onChange={(e) =>
                setActiveVideo({ ...activeVideo, url: e.target.value })
              }
            />

            <button
              onClick={handleUpdateVideo}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </OpenModal>
    </section>
  );
};
