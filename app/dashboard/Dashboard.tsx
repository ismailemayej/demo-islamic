"use client";

import { useState, useEffect } from "react";
import { Textarea, Button, Spinner, Card } from "@heroui/react";
import { Input } from "@heroui/input";
import { toast } from "sonner";
import Image from "next/image";
import { useGetSection } from "./Hook/GetData";
import { CiSquareRemove } from "react-icons/ci";
import { FaRegEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";

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

export default function DashboardPage() {
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

  // When section loads, map incoming NavLinks to ensure URL consistency
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // When a NavLink's name is changed (via dropdown), set its URL automatically
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
        // if selected name is not from MASTER, leave url as empty
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

  // Image Upload/Delete
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
      <Card className="lg:p-4 p-2 shadow-2xl rounded bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            {formData.sitetitle || "🌐 Website Dashboard"}
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

        {/* Preview */}
        {!isEditing && (
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Menu Links Preview */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {formData.NavLinks.map((link) => (
                  <button
                    key={link.id}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

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
              {formData.ownerName || "Website Owner"}
            </h3>
            <p className="bangla text-gray-600 dark:text-gray-300 max-w-md">
              {formData.description || "Website description will appear here."}
            </p>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="space-y-5 mt-4">
            <Input
              size="md"
              label="Website Title"
              value={formData.sitetitle}
              onChange={(e) => handleChange("sitetitle", e.target.value)}
            />
            <Input
              size="md"
              label="Website Owner Name"
              value={formData.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
            />
            <Textarea
              label="Website Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              minRows={4}
            />
            <Textarea
              label="Website Keywords"
              value={formData.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
              minRows={1}
            />

            {/* Profile Image */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">
                Profile Image
              </label>
              {formData.profileImage ? (
                <div className="relative w-44 h-44 rounded-xl overflow-hidden border-2 border-indigo-400 shadow-lg">
                  <img
                    src={formData.profileImage}
                    alt="Profile"
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
                  <Input
                    size="md"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <p className="text-gray-500 mt-1 text-sm">
                    Click to upload image
                  </p>
                </div>
              )}
            </div>

            {/* Menu Links Editor */}
            <div className="mt-4 ">
              <h4 className="lg:max-w-[460px] font-semibold text-lg flex items-center justify-between">
                Menu Links
                <FaPlus
                  className="cursor-pointer text-green-500 border rounded-full p-1 w-7 h-7"
                  onClick={handleAddNavLink}
                />
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.NavLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center space-x-2 mt-2"
                  >
                    <select
                      className="border rounded p-2 w-40"
                      value={link.name}
                      onChange={(e) =>
                        handleNavLinkChange(index, "name", e.target.value)
                      }
                    >
                      <option className="dark:bg-gray-900" value="">
                        Select Menu
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

                    <Input
                      className=" lg:max-w-[140px]"
                      placeholder="URL (auto)"
                      value={link.url}
                      disabled
                    />

                    <BsTrash3Fill
                      className="text-rose-500 cursor-pointer w-7 h-5"
                      onClick={() => handleDeleteNavLink(link.id)}
                    />
                  </div>
                ))}
              </div>
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
