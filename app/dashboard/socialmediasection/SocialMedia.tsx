"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { useGetSection } from "../Hook/GetData";
import { Plus, Trash2, Save, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaRedditAlien,
  FaTiktok,
  FaWhatsapp,
  FaRegEdit,
} from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { Input } from "@heroui/input";
import { IoAddCircleSharp } from "react-icons/io5";

interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
}

interface SocialMediaSectionData {
  heading: { title: string; subTitle: string };
  data: SocialLink[];
}

const SOCIAL_OPTIONS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "Pinterest",
  "Snapchat",
  "Reddit",
  "TikTok",
  "WhatsApp",
];

export const SocialMediaSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("socialmediasection");

  const [formData, setFormData] = useState<SocialMediaSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        heading: {
          title: section.heading?.title || "",
          subTitle: section.heading?.subTitle || "",
        },
        data: section.data || [],
      });
    }
  }, [section]);

  // Handle changes
  const handleChange = (
    sectionType: "heading" | "data",
    field: string,
    value: string,
    index?: number
  ) => {
    if (sectionType === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: { ...prev.heading, [field]: value },
      }));
    } else if (sectionType === "data" && index !== undefined) {
      const updated = [...formData.data];
      (updated[index] as any)[field] = value;

      if (field === "iconName") {
        (updated[index] as any).name = value;
      }

      setFormData((prev) => ({ ...prev, data: updated }));
    }
  };

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          iconName: "Facebook",
          name: "Facebook",
          url: "",
        },
      ],
    }));
  };

  const handleDelete = (index: number) => {
    const updated = [...formData.data];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: updated }));
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/socialmediasection/update", {
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

  const getIcon = (name: string) => {
    switch (name) {
      case "Facebook":
        return <FaFacebookF />;
      case "Twitter":
        return <FaTwitter />;
      case "Instagram":
        return <FaInstagram />;
      case "YouTube":
        return <FaYoutube />;
      case "LinkedIn":
        return <FaLinkedinIn />;
      case "Pinterest":
        return <FaPinterestP />;
      case "Snapchat":
        return <FaSnapchatGhost />;
      case "Reddit":
        return <FaRedditAlien />;
      case "TikTok":
        return <FaTiktok />;
      case "WhatsApp":
        return <FaWhatsapp />;
      default:
        return <FaFacebookF />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center py-10">
        {error || "Something went wrong!"}
      </p>
    );

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-0">
        {/* Heading + Edit Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 text-center">
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
            />
          </div>
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

        {/* Edit Form */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 mb-10 space-y-4">
            <span className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-amber-700 lg:block hidden">
                ✏️ Edit Social Media Section
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </span>

            {/* Heading Inputs */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                size="md"
                type="text"
                label="Section Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700"
              />
              <Input
                size="md"
                type="text"
                label="Section Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 space-y-4 max-h-[60vh] overflow-y-auto">
              {formData.data.map((social, i) => (
                <motion.div
                  key={social.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-gradient-to-r from-amber-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid grid-cols-1 gap-2"
                >
                  <button onClick={() => handleDelete(i)}>
                    <BsTrash3Fill className="dark:text-rose-300 text-rose-500 cursor-pointer w-6 h-5" />
                  </button>

                  <Input
                    size="md"
                    type="text"
                    label="Name"
                    value={social.name}
                    disabled
                    className="border p-2 rounded-lg dark:bg-gray-700 flex-1 cursor-not-allowed"
                  />
                  <Input
                    size="md"
                    type="text"
                    label="URL"
                    value={social.url}
                    onChange={(e) =>
                      handleChange("data", "url", e.target.value, i)
                    }
                    className="border p-2 rounded-lg dark:bg-gray-700 flex-1"
                  />
                  <select
                    value={social.iconName}
                    onChange={(e) =>
                      handleChange("data", "iconName", e.target.value, i)
                    }
                    className="border p-2 rounded-lg dark:bg-gray-700 dark:text-white "
                  >
                    {SOCIAL_OPTIONS.map((option) => (
                      <option
                        className="dark:text-white"
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {formData.data?.map((social, index) => (
            <motion.a
              key={social.id}
              href={social.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 group"
            >
              <div className="text-5xl text-emerald-700 dark:text-emerald-400 mb-3 group-hover:text-amber-500 transition-colors">
                {getIcon(social.iconName)}
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
