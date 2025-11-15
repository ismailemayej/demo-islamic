"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Trash2, Plus, Save, XCircle } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/spinner";
import { BsTrash3Fill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { Input } from "@heroui/input";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

interface GallerySectionData {
  heading: { title: string; subTitle: string };
  data: GalleryItem[];
}

export const GallerySectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("gallerysection");

  const [formData, setFormData] = useState<GallerySectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // ---------- HANDLE INPUT CHANGE ----------
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
      setFormData((prev) => ({ ...prev, data: updated }));
    }
  };

  // ---------- ADD NEW ITEM ----------
  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [...prev.data, { id: Date.now().toString(), title: "", image: "" }],
    }));
  };

  // ---------- DELETE ITEM ----------
  const handleDeleteItem = async (index: number) => {
    const item = formData.data[index];
    if (item.image) {
      await handleImageDelete(index); // Cloudinary থেকে ডিলিট
    }
    const updated = [...formData.data];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: updated }));
  };

  // ---------- IMAGE UPLOAD ----------
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading("Uploading image...", { id: "upload" });

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (data?.secure_url) {
        handleChange("data", "image", data.secure_url, index);
        toast.dismiss("upload");
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      toast.dismiss("upload");
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- IMAGE DELETE FROM CLOUDINARY ----------
  const handleImageDelete = async (index: number) => {
    const imageUrl = formData.data[index]?.image;
    if (!imageUrl) return;

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      handleChange("data", "image", "", index);
      toast.dismiss("delete");
      toast.success("Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- SAVE TO DATABASE ----------
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/gallerysection/update", {
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

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <section
      id="gallery"
      className="py-24 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <span className="flex gap-2 items-center">
            <button onClick={handleAdd}>
              <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
            </button>
            <button onClick={() => setEditing(!editing)} className="transition">
              {editing ? (
                <XCircle size={25} className="text-yellow-500" />
              ) : (
                <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
              )}
            </button>
          </span>
        </div>

        {editing && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 mb-10 space-y-4">
            <span className="flex justify-between">
              <h3 className="text-lg font-semibold text-amber-700 lg:block hidden">
                ✏️ Edit Gallery Section
              </h3>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </span>

            {/* Heading */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                size="md"
                type="text"
                label="Section Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <Input
                size="md"
                type="text"
                label="Section Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="border p-2 rounded-lg dark:text-white dark:bg-gray-700"
              />
            </div>

            {/* Gallery Items */}
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
              {formData.data.map((item, i) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => handleDeleteItem(i)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5 z-10" />
                  </button>

                  <Input
                    size="md"
                    type="text"
                    label="Title"
                    value={item.title}
                    onChange={(e) =>
                      handleChange("data", "title", e.target.value, i)
                    }
                    className="w-full border-b border-gray-300 dark:bg-gray-700 p-1 mb-2"
                  />

                  {/* File Input */}
                  <label
                    htmlFor={`file-input-${i}`}
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-gray-600 transition-colors mb-2"
                  >
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.image ? "Change Image" : "Upload Image"}
                    </span>
                  </label>
                  <Input
                    size="md"
                    id={`file-input-${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, i)}
                    className="hidden"
                  />

                  {item.image && (
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title || "Preview"}
                        className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10"
                      >
                        <BsTrash3Fill className="text-white cursor-pointer w-5 h-5 " />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Display Gallery */}
        <div className="grid gap-2 mt-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 auto-rows-[200px] lg:auto-rows-[300px]">
          {formData.data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-xl group shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-700 ${i === 1 || i === 0 || i === 5 || i === 2 ? "col-span-2" : ""} ${i === 2 ? "row-span-2" : ""}`}
            >
              {" "}
              <img
                src={item.image}
                alt={item.title || "Gallery Image"}
                className="w-full h-full object-cover transform duration-300 group-hover:scale-105"
              />{" "}
              {/* Overlay caption */}{" "}
              {item.title && (
                <div className="absolute bottom-2 left-2 bg-amber-600/80 dark:bg-amber-500/80 text-white dark:text-gray-900 text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm">
                  {" "}
                  {item.title}{" "}
                </div>
              )}{" "}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
