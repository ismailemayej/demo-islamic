"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  UploadCloud,
  Trash2,
  Edit2,
  XCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import { useGetSection } from "../Hook/GetData";
import profile from "@/public/images/profile.png";
import { FaRegEdit } from "react-icons/fa";
import { CiSquareRemove } from "react-icons/ci";
import { Input } from "@heroui/input";

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

  // 🟢 Alert system
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

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

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: "" }), 3000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // 🟢 Upload Image Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    showAlert("success", "Uploading image...");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (data?.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        showAlert("success", "✅ Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      showAlert("error", err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🟠 Delete Image Handler
  const handleImageDelete = async () => {
    if (!formData.image) {
      showAlert("error", "No image to delete!");
      return;
    }

    setUploading(true);
    showAlert("success", "Deleting image...");

    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formData.image }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Delete failed");

      setFormData((prev) => ({ ...prev, image: "" }));
      showAlert("success", "🗑️ Image deleted successfully!");
    } catch (err: any) {
      showAlert("error", err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Save Handler
  const handleSave = async () => {
    setUploading(true);
    showAlert("success", "Saving data...");

    try {
      const res = await fetch("/api/all-data/herosection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      showAlert("success", "✅ Saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      showAlert("error", err.message || "Save failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bangla relative py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      {/* 🔔 HeroUI Alert */}
      {alert.type && (
        <div className="fixed top-4 right-4 z-50 w-[90%] sm:w-auto">
          <Alert
            color={alert.type === "success" ? "success" : "danger"}
            icon={alert.type === "success" ? <CheckCircle /> : <XCircle />}
            title={alert.type === "success" ? "Success" : "Error"}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start"
        >
          <div className="relative w-full max-w-md">
            {isEditing && (
              <>
                <label className="flex items-center justify-center gap-2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer transition w-full max-w-md">
                  <UploadCloud className="w-5 h-5" />
                  {uploading ? "Processing..." : "Upload Image"}
                  <Input
                    size="md"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>

                {/* 🗑️ Delete Button */}
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
              </>
            )}
            <img
              src={formData.image || profile.src}
              alt="Hero Image"
              className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto object-cover rounded-3xl shadow-2xl mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = profile.src;
                setFormData((prev) => ({ ...prev, image: "" }));
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
          <div className="">
            <div className="space-y-2 w-full">
              <span className="flex items-start justify-between-center">
                <Input
                  size="md"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  label="Title"
                  disabled={!isEditing}
                  className={`w-full p-2 rounded text-3xl font-semibold dark:text-emerald-400 text-emerald-700 ${
                    isEditing
                      ? "border border-gray-400"
                      : "bg-transparent border-0"
                  }`}
                />
                <button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <XCircle size={25} className="text-yellow-500" />
                  ) : (
                    <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
                  )}
                </button>
              </span>

              <Input
                size="md"
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
                }
                label="SubTitle"
                disabled={!isEditing}
                className={`w-full p-2 rounded text-4xl font-bold dark:text-white ${
                  isEditing
                    ? "border border-gray-400"
                    : "bg-transparent border-0"
                }`}
              />

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                disabled={!isEditing}
                className={`font-sans w-full dark:text-white p-4 rounded-lg text-lg md:text-xl lg:text-xl ${
                  isEditing
                    ? "border border-gray-400 bg-white dark:bg-gray-700"
                    : "bg-transparent border-0"
                } h-40 md:h-48 lg:h-60 resize-y`}
                style={{ minHeight: "10rem" }} // optional inline for extra height
              />
            </div>
          </div>

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
