"use client";

import { useState, useEffect } from "react";
import { Textarea, Button, Spinner, Card } from "@heroui/react";
import { Input } from "@heroui/input";
import { toast } from "sonner";
import Image from "next/image";

import { CiSquareRemove } from "react-icons/ci";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
// Assuming this is a custom hook and will be kept as is
import { useGetSection } from "../Hook/GetData";

// MASTER NAV LINKS (Fixed list)
const MASTER_NAV_LINKS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "#about" },
  { id: 3, name: "Videos", href: "#youtubevideos" },
  { id: 4, name: "Gallary", href: "#gallery" },
  { id: 5, name: "Proggams", href: "#programs" },
  { id: 6, name: "Social", href: "#social" },
  { id: 7, name: "Contact", href: "#contact" },
  { id: 8, name: "Organizations", href: "#organizations" },
  { id: 9, name: "Books", href: "#books" },
  { id: 10, name: "Testimonials", href: "#testimonials" },
  { id: 11, name: "Education", href: "#education" },
  { id: 12, name: "Achivments", href: "#achievements" },
  { id: 13, name: "Blogs", href: "#blog" },
  { id: 14, name: "Certificate", href: "#certificates" },
  { id: 15, name: "Team", href: "#teams" },
  { id: 16, name: "Appoinment", href: "#booking" },
  { id: 17, name: "Services", href: "#services" },
];

interface NavLink {
  id: string;
  name: string;
  url: string;
}

export default function SiteInfo() {
  const { section, loading, error } = useGetSection("websitesection");

  const [formData, setFormData] = useState({
    ownerName: "",
    description: "",
    profileImage: "",
    sitetitle: "",
    keywords: "",
    NavLinks: [] as NavLink[],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // When section loads, map incoming NavLinks to ensure URL consistency (Data Logic: KEPT)
  useEffect(() => {
    if (section?.data) {
      const incomingLinks: NavLink[] = (section.data.NavLinks || []).map(
        (link: any) => {
          // try to find by name in MASTER list
          const found = MASTER_NAV_LINKS.find(
            (m) => m.name.toLowerCase() === (link.name || "").toLowerCase()
          );
          return {
            id: link.id?.toString() || Date.now().toString(),
            name: link.name || "",
            url: found ? found.href : link.url || "",
          } as NavLink;
        }
      );

      setFormData({
        ownerName: section.data.ownerName || "",
        description: section.data.description || "",
        profileImage: section.data.profileImage || "",
        keywords: section.data.keywords || "",
        sitetitle: section.data.sitetitle || "",
        NavLinks: incomingLinks.length
          ? incomingLinks
          : MASTER_NAV_LINKS.map((m) => ({
              id: m.id.toString(),
              name: m.name,
              url: m.href,
            })),
      });
    }
  }, [section]);

  // Handler functions (Data Logic: KEPT)
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNavLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...formData.NavLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value } as NavLink;

    if (field === "name") {
      const found = MASTER_NAV_LINKS.find(
        (item) => item.name.toLowerCase() === value.toLowerCase()
      );
      if (found) {
        updatedLinks[index].url = found.href;
      } else {
        updatedLinks[index].url = "";
      }
    }

    setFormData((prev) => ({ ...prev, NavLinks: updatedLinks }));
  };

  const handleAddNavLink = () => {
    setFormData((prev) => ({
      ...prev,
      NavLinks: [
        ...prev.NavLinks,
        { id: Date.now().toString(), name: "", url: "" },
      ],
    }));
  };

  const handleDeleteNavLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      NavLinks: prev.NavLinks.filter((link) => link.id !== id),
    }));
  };

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

  // Loading/Error States (Design: IMPROVED)
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label="Loading Website Data..." />
      </div>
    );
  if (error)
    return (
      <Card className="m-4 p-6 bg-red-100 dark:bg-red-900 border border-red-400">
        <p className="text-red-700 dark:text-red-300 text-center font-semibold">
          Error loading section: {error}
        </p>
      </Card>
    );

  // Main Dashboard Structure (Design: IMPROVED)
  return (
    <section className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Header and Edit Button */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            {formData.sitetitle || "🌐 Website Configuration"}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                color="primary"
                variant="flat"
                className="font-semibold"
              >
                <FaRegEdit className="w-4 h-4 mr-1" /> Edit Info
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(false)}
                color="secondary"
                variant="flat"
                className="font-semibold"
              >
                <CiSquareRemove className="w-6 h-6" /> Close Edit
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {/* Preview Mode */}
          {!isEditing && (
            <div className="space-y-8">
              {/* Owner/Profile Info */}
              <div className="flex flex-col lg:flex-row items-start gap-8 p-6 bg-indigo-50 dark:bg-gray-700 rounded-xl shadow-inner">
                {/* Image */}
                <div className="flex-shrink-0">
                  {formData.profileImage ? (
                    <Image
                      src={formData.profileImage}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="rounded-full object-cover shadow-xl border-4 border-indigo-500 p-1"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                      No Image
                    </div>
                  )}
                </div>

                {/* Text Info */}
                <div className="space-y-2">
                  <h3 className="bangla text-4xl font-bold text-gray-800 dark:text-white">
                    {formData.ownerName || "Website Owner Name"}
                  </h3>
                  <p className="bangla text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    {formData.description ||
                      "Website description will appear here."}
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    Keywords: {formData.keywords || "No keywords set."}
                  </p>
                </div>
              </div>

              {/* Menu Links Preview */}
              <div className="border-t pt-6 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Navigation Menu Links ({formData.NavLinks.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {formData.NavLinks.map((link) => (
                    <span
                      key={link.id}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium text-sm transition-transform hover:scale-[1.02]"
                      title={`URL: ${link.url}`}
                    >
                      {link.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="space-y-8">
              {/* General Info Card */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
                  General Website Information
                </h3>
                <div className="space-y-4">
                  <Input
                    size="md"
                    label="Website Title"
                    value={formData.sitetitle}
                    onChange={(e) => handleChange("sitetitle", e.target.value)}
                    placeholder="Enter the main title for the website"
                  />
                  <Input
                    size="md"
                    label="Website Owner Name"
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    placeholder="e.g., Mizanur Rahman Azhari"
                  />
                  <Textarea
                    label="Website Description (Meta Description)"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    minRows={4}
                    placeholder="A concise summary of the website content for search engines."
                  />
                  <Textarea
                    label="Website Keywords (SEO)"
                    value={formData.keywords}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    minRows={1}
                    placeholder="Comma separated list of keywords (e.g., islam, lecture, bangla)"
                  />
                </div>
              </div>

              {/* Profile Image Card */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
                  Profile Image Upload
                </h3>

                {formData.profileImage ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl flex-shrink-0">
                      <Image
                        src={formData.profileImage}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <Button
                      onClick={handleImageDelete}
                      color="danger"
                      isLoading={uploading}
                      className="font-semibold"
                    >
                      <BsTrash3Fill className="w-4 h-4 mr-1" /> Delete Current
                      Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-indigo-600 transition duration-300 bg-gray-50 dark:bg-gray-700">
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Upload New Profile Image
                    </label>
                    <Input
                      size="lg"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-gray-500 mt-2 text-sm">
                      PNG, JPG, or GIF (Max 5MB). Click to browse.
                    </p>
                  </div>
                )}
              </div>

              {/* Menu Links Editor Card */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400">
                    Navigation Menu Links Editor
                  </h3>
                  <Button
                    onClick={handleAddNavLink}
                    color="success"
                    variant="flat"
                    size="sm"
                    className="font-semibold"
                  >
                    <FaPlus className="mr-1" /> Add New Link
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.NavLinks.map((link, index) => (
                    <div
                      key={link.id}
                      className="flex flex-wrap items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
                    >
                      {/* Select Nav Link Name */}
                      <select
                        className="border rounded-lg p-2 w-full sm:w-48 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                        value={link.name}
                        onChange={(e) =>
                          handleNavLinkChange(index, "name", e.target.value)
                        }
                      >
                        <option className="dark:bg-gray-900" value="">
                          Select Menu Section
                        </option>
                        {MASTER_NAV_LINKS.map((item) => (
                          <option
                            className="dark:bg-gray-900"
                            key={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>

                      {/* URL (Disabled) */}
                      <Input
                        className="w-full sm:flex-1 dark:bg-gray-900 dark:border-gray-600"
                        placeholder="URL (Automatic Hash Link)"
                        value={link.url}
                        disabled
                      />

                      {/* Delete Button */}
                      <Button
                        color="danger"
                        variant="ghost"
                        onClick={() => handleDeleteNavLink(link.id)}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <BsTrash3Fill className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <Button
                color="success"
                onClick={handleSave}
                isLoading={saving}
                size="lg"
                className="w-full font-extrabold tracking-wide"
                disabled={saving || uploading}
              >
                💾 Save All Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
