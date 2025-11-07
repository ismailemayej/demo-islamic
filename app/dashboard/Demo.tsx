"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";

export default function UploadButton() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // যখন ইউজার ফাইল সিলেক্ট করে তখন প্রিভিউ দেখাও
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // আপলোড হ্যান্ডলার
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.secure_url) {
      setImageUrl(data.secure_url);
      setPreview(null); // preview clear করে দিচ্ছি
      alert("✅ Upload Successful!");
    } else {
      alert("❌ Upload failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-100">
        Upload Certificate Image
      </h2>

      {/* File Input */}
      <div className="flex flex-col items-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-gray-600 dark:text-gray-300 flex flex-col items-center"
        >
          <UploadCloud className="w-8 h-8 mb-2 text-blue-500" />
          <span>Click to choose an image</span>
        </label>
      </div>

      {/* Preview Image */}
      {preview && (
        <div className="mb-4">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="rounded-xl shadow-md object-cover mx-auto"
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:bg-gray-400 flex items-center justify-center mx-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Uploading...
          </>
        ) : (
          "Upload to Cloudinary"
        )}
      </button>

      {/* Uploaded Image */}
      {imageUrl && (
        <div className="mt-6">
          <h3 className="text-sm text-gray-500 mb-2">Uploaded Image:</h3>
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={300}
            height={200}
            className="rounded-xl shadow-lg mx-auto"
          />
          <p className="text-xs text-gray-400 mt-2 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
