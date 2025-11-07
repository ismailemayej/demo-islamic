"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";

export const SidebarProfile = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ডাটাবেস থেকে প্রোফাইল ইমেজ লোড
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data?.imageUrl) setImageUrl(data.imageUrl);
    };
    fetchProfile();
  }, []);

  // ফাইল আপলোড হ্যান্ডলার
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Cloudinary API call
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.secure_url) throw new Error("Upload failed");

      // MongoDB তে সেভ করা
      const saveRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.secure_url }),
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error("DB save failed");

      setImageUrl(data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Upload or save failed!");
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ ডিলিট
  const handleDelete = async () => {
    if (!imageUrl) return;

    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (!publicId) return alert("Invalid image URL");

    try {
      // Cloudinary delete
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });
      const result = await res.json();
      if (!result.success) throw new Error("Cloudinary delete failed");

      // MongoDB থেকে মুছে ফেলা
      const dbRes = await fetch("/api/profile", { method: "DELETE" });
      const dbResult = await dbRes.json();
      if (!dbResult.success) throw new Error("DB delete failed");

      setImageUrl(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        {imageUrl ? (
          <div className="relative group">
            <Image
              src={imageUrl}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-green-500 object-cover"
            />
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              title="Delete image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <>
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <UploadCloud className="w-5 h-5 text-blue-500" />
              {loading ? "Uploading..." : "Upload / Change"}
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      <h2 className="lg:block hidden text-xl font-semibold text-gray-800 dark:text-gray-100">
        Dashboard
      </h2>
    </div>
  );
};
