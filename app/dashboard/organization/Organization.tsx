"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";
import { useGetSection } from "../Hook/GetData";
import { Plus, Trash2, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface Organization {
  id: string;
  name: string;
  possition: string;
  address: string;
  director: string;
  img: string;
  details: string;
}

interface OrganizationSectionData {
  heading: { title: string; subTitle: string };
  data: Organization[];
}

export const OrganizationSectionDashboard = () => {
  const { section, loading, error } = useGetSection("organizationsection");

  const [formData, setFormData] = useState<OrganizationSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

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

  // ------------ Handle Changes ------------
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

  // ------------ Add & Delete Organization ------------
  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          name: "",
          possition: "",
          address: "",
          director: "",
          img: "",
          details: "",
        },
      ],
    }));
  };

  const handleDelete = (index: number) => {
    const updated = [...formData.data];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: updated }));
  };

  // ------------ Cloudinary Image Upload ------------
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
        handleChange("data", "img", data.secure_url, index);
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

  // ------------ Cloudinary Image Delete ------------
  const handleImageDelete = async (index: number) => {
    const imageUrl = formData.data[index].img;
    if (!imageUrl) return;

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      handleChange("data", "img", "", index);

      toast.dismiss("delete");
      toast.success("Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  // ------------ Save Changes ------------
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/organizationsection/update", {
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
    <section className="relative py-20 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 dark:text-gray-200 transition-colors duration-700 bangla">
      <div className="container mx-auto text-center">
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* ---------- Edit Panel ---------- */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 mb-10 space-y-4">
            <h3 className="text-lg font-semibold text-amber-700">
              ✏️ Edit Organization Section
            </h3>

            {/* Heading Inputs */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Section Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Section Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="border p-2 rounded-lg dark:bg-gray-700"
              />
            </div>

            {/* Organization Items */}
            <div className=" grid lg:grid-cols-3 grid-cols-1 gap-2">
              {formData.data.map((org, i) => (
                <motion.div
                  key={org.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-gradient-to-r from-amber-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => handleDelete(i)}
                    className="z-10 border p-1 rounded-full bg-white absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid grid-cols-1 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={org.name}
                      onChange={(e) =>
                        handleChange("data", "name", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={org.possition}
                      onChange={(e) =>
                        handleChange("data", "possition", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Address"
                      value={org.address}
                      onChange={(e) =>
                        handleChange("data", "address", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Director"
                      value={org.director}
                      onChange={(e) =>
                        handleChange("data", "director", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Details"
                      value={org.details}
                      onChange={(e) =>
                        handleChange("data", "details", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="flex items-center gap-2">
                    {org.img && (
                      <img
                        src={org.img}
                        alt={org.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, i)}
                      className="border p-1 rounded-lg w-32"
                    />
                    {org.img && (
                      <button
                        onClick={() => handleImageDelete(i)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex justify-between items-center">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus size={18} /> Add Organization
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ---------- Display Organizations ---------- */}
        <div className="grid gap-4 sgrid-cols-2 lg:grid-cols-3 justify-items-center mt-8">
          {formData.data.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="w-full cursor-pointer"
            >
              <Card
                isHoverable
                className="flex flex-col items-center shadow-xl bg-white/80 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 backdrop-blur-lg rounded-2xl transition-all duration-300"
              >
                {org.img && (
                  <img
                    src={org.img}
                    alt={org.name}
                    className="w-full h-40 object-cover rounded-t-2xl"
                    onClick={() => setSelectedOrg(org)}
                  />
                )}
                <CardBody className="text-center py-4">
                  <h4
                    className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                  >
                    {org.name}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    পজিশন: {org.possition}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    ঠিকানা: {org.address}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedOrg && (
          <OpenModal
            title={selectedOrg.name}
            isOpen={!!selectedOrg}
            onClose={() => setSelectedOrg(null)}
            size="lg"
          >
            {selectedOrg.img && (
              <img
                src={selectedOrg.img}
                alt={selectedOrg.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700 dark:text-gray-200">
              <strong>পরিচালক:</strong> {selectedOrg.director}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-1">
              <strong>ঠিকানা:</strong> {selectedOrg.address}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-2">
              {selectedOrg.details}
            </p>
          </OpenModal>
        )}
      </div>
    </section>
  );
};
