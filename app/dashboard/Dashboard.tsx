"use client";

import { useState, useEffect } from "react";
import { Input, Textarea, Button, Spinner, Card } from "@heroui/react";
import { toast } from "sonner";
import Image from "next/image";
import { useGetSection } from "./Hook/GetData";
import { CiSquareRemove } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";

export default function DashboardPage() {
  const { section, loading, error } = useGetSection("websitesection");

  const [formData, setFormData] = useState({
    sitetitle: "",
    description: "",
    profileImage: "",
    keywords: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🟢 Load Data from API
  useEffect(() => {
    if (section?.data) {
      setFormData({
        sitetitle: section.data.sitetitle || "",
        description: section.data.description || "",
        profileImage: section.data.profileImage || "",
        keywords: section.data.keywords || "",
      });
    }
  }, [section]);

  // 🟢 Handle Input Change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🟢 Upload Image to Cloudinary
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
        setFormData((prev) => ({ ...prev, profileImage: data.secure_url }));
        toast.dismiss("upload");
        toast.success("✅ Image uploaded successfully!");
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

  // 🟢 Delete Image
  const handleImageDelete = async () => {
    if (!formData.profileImage) return;
    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formData.profileImage }),
      });

      setFormData((prev) => ({ ...prev, profileImage: "" }));
      toast.dismiss("delete");
      toast.success("🗑️ Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Save Data
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/websitesection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // 🟡 Loading & Error
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Loading Dashboard..." />
      </div>
    );
  if (error)
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <section className="mx-auto">
      <Card className="lg:p-4 p-2 shadow-2xl rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            🌐 Website Dashboard
          </h2>

          {!isEditing ? (
            <FaRegEdit
              className="text-yellow-500 cursor-pointer w-7 h-6"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <CiSquareRemove
              className="bg-yellow-500 text-black rounded cursor-pointer w-7 h-8"
              onClick={() => setIsEditing(false)}
            />
          )}
        </div>

        {/* 🔹 PREVIEW MODE */}
        {!isEditing && (
          <div className="flex flex-col items-center text-center space-y-4">
            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full shadow-lg border-4 border-indigo-500"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <h3 className="bangla text-2xl font-bold text-gray-800 dark:text-white">
              {formData.sitetitle || "Website Title"}
            </h3>
            <p className="bangla text-gray-600 dark:text-gray-300 max-w-md">
              {formData.description ||
                "This is where your website description will appear."}
            </p>
          </div>
        )}

        {/* 🔹 EDIT MODE */}
        {isEditing && (
          <div className="space-y-5 mt-4">
            <Input
              label="Website Title"
              value={formData.sitetitle}
              onChange={(e) => handleChange("sitetitle", e.target.value)}
              placeholder="Enter your website title"
              className="dark:text-gray-100"
            />

            <Textarea
              label="Website Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              minRows={4}
              placeholder="Write a short description..."
            />
            <Textarea
              label="Website keywords"
              value={formData.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
              minRows={1}
              placeholder="Write all keywords..."
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700 dark:text-gray-200">
                Profile Image
              </label>
              {formData.profileImage ? (
                <div className="relative w-44 h-44 rounded-xl overflow-hidden border-2 border-indigo-400 shadow-lg">
                  <Image
                    src={formData.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleImageDelete}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center hover:border-indigo-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  />
                  <p className="text-gray-500 mt-1 text-sm">
                    Click to upload image
                  </p>
                </div>
              )}
            </div>

            <Button
              color="success"
              onClick={handleSave}
              isLoading={saving}
              className="w-full mt-4 font-semibold"
            >
              💾 Save Changes
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
