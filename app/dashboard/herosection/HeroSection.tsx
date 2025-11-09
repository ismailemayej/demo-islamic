"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, UploadCloud, Trash2, Edit2 } from "lucide-react";
import { Button } from "@heroui/button";
import { useGetSection } from "../Hook/GetData";
import toast, { Toaster } from "react-hot-toast";
import profile from "@/public/images/profile.png";

export const HeroSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection<any>("herosection");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    description: "",
    buttonText: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (section?.data) {
      setFormData({
        title: section.data.title || "",
        subTitle: section.data.subTitle || "",
        description: section.data.description || "",
        buttonText: section.data.buttonText || "",
        image: section.data.image || "",
      });
    }
  }, [section]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const notify = (msg: string, type: "success" | "error" = "success") => {
    type === "success" ? toast.success(msg) : toast.error(msg);
  };

  // 🟢 Upload Image Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.dismiss("upload");
        notify("✅ Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      toast.dismiss("upload");
      notify(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // 🟠 Delete Image Handler
  const handleImageDelete = async () => {
    if (!formData.image) {
      notify("No image to delete!", "error");
      return;
    }

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formData.image }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Delete failed");

      setFormData((prev) => ({ ...prev, image: "" })); // ✅ reset image
      toast.dismiss("delete");
      notify("🗑️ Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      notify(err.message || "Delete failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Save Handler
  const handleSave = async () => {
    setUploading(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/herosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      notify("✅ Saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.dismiss("save");
      notify(err.message || "Save failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bangla relative py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      <Toaster position="top-right" />
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start"
        >
          <div className="relative w-full max-w-md">
            {/* ✅ Conditional Image Preview */}
            {isEditing && (
              <>
                <label className="flex items-center justify-center gap-2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer transition w-full max-w-md">
                  <UploadCloud className="w-5 h-5" />
                  {uploading ? "Processing..." : "Upload Image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>

                {/* 🗑️ Delete Button (Only when Editing) */}
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={handleImageDelete}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
            <img
              src={formData.image || profile.src}
              alt="Hero Image"
              className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-cover rounded-3xl shadow-2xl mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = profile.src; // fallback
                setFormData((prev) => ({ ...prev, image: "" })); // remove broken link
              }}
            />
          </div>
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
              {/* Title */}
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
                disabled={!isEditing}
                className={`w-full p-2 rounded text-3xl font-semibold text-emerald-700 ${
                  isEditing
                    ? "border border-gray-400"
                    : "bg-transparent border-0"
                }`}
              />

              {/* SubTitle */}
              <input
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
                }
                placeholder="SubTitle"
                disabled={!isEditing}
                className={`w-full p-2 rounded text-4xl font-bold ${
                  isEditing
                    ? "border border-gray-400"
                    : "bg-transparent border-0"
                }`}
              />

              {/* Description */}
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                disabled={!isEditing}
                className={`w-full p-2 rounded text-lg ${
                  isEditing
                    ? "border border-gray-400"
                    : "bg-transparent border-0"
                }`}
              />

              {/* Button Text */}
              <input
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                placeholder="Button Text"
                disabled={!isEditing}
                className={`w-full p-2 rounded ${
                  isEditing
                    ? "border border-gray-400"
                    : "bg-transparent border-0"
                }`}
              />
            </div>

            {/* Edit Button */}
            <Button
              size="sm"
              className="bg-blue-600 text-white flex items-center gap-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* Save Button */}
          {isEditing && (
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-emerald-600 text-white mt-2"
              disabled={uploading}
            >
              {uploading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" /> Save
                </>
              )}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
