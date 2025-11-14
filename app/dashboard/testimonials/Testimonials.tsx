"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";
import { Button } from "@heroui/button";
import { OpenModal } from "@/components/Modal";
import { Input } from "@heroui/input";
import { BsTrash3Fill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  image?: string;
}

interface TestimonialSectionData {
  heading: { title: string; subTitle: string };
  data: Testimonial[];
}

export const TestimonialsSectionDashboard: React.FC = () => {
  const { section } = useGetSection("testimonialsection");

  const [formData, setFormData] = useState<TestimonialSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleChange = (field: keyof Testimonial, value: string) => {
    if (!selectedTestimonial) return;
    setSelectedTestimonial({ ...selectedTestimonial, [field]: value });
  };

  const handleModalSave = async () => {
    if (!selectedTestimonial) return;
    const exists = formData.data.some((t) => t.id === selectedTestimonial.id);
    const updatedData = exists
      ? formData.data.map((t) =>
          t.id === selectedTestimonial.id ? selectedTestimonial : t
        )
      : [...formData.data, selectedTestimonial];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);

    setSaving(true);
    toast.loading("Saving...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/testimonialsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setModalOpen(false);
      setSelectedTestimonial(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((t) => t.id !== id),
    };
    setFormData(updated);

    setSaving(true);
    toast.loading("Deleting...", { id: "delete" });
    try {
      const res = await fetch("/api/all-data/testimonialsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Delete failed");
      toast.dismiss("delete");
      toast.success("✅ Deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTestimonial) return;
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
        setSelectedTestimonial({
          ...selectedTestimonial,
          image: data.secure_url,
        });
        toast.dismiss("upload");
        toast.success("Image uploaded successfully!");
      } else throw new Error("Upload failed");
    } catch (err: any) {
      toast.dismiss("upload");
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = () => {
    if (!selectedTestimonial?.image) return;
    setSelectedTestimonial({ ...selectedTestimonial, image: "" });
    toast.success("Image deleted!");
  };

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-0">
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />

          <div className="flex items-center gap-3">
            {/* Add New Testimonial */}
            <button
              onClick={() => {
                const newTestimonial: Testimonial = {
                  id: Date.now().toString(),
                  name: "",
                  role: "",
                  comment: "",
                  image: "",
                };
                setSelectedTestimonial(newTestimonial);
                setModalOpen(true);
              }}
            >
              <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
            </button>
            {/* Heading Edit Button */}
            <button
              onClick={() => {
                setSelectedTestimonial(null);
                setModalOpen(true);
              }}
            >
              <FaRegEdit className="text-green-500 cursor-pointer w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="mt-3 grid gap-8 md:grid-cols-4">
          {formData.data.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full relative"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => {
                    setSelectedTestimonial(t);
                    setModalOpen(true);
                  }}
                >
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5" />
                </button>
              </div>

              {t.image && (
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 mb-2"
                />
              )}
              <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                {t.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t.role}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mt-2 flex-1">
                {t.comment}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <OpenModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={selectedTestimonial ? "Edit Testimonial" : "Edit Heading"}
          >
            {/* Modal scroll enabled */}
            <div className="flex flex-col space-y-3 max-h-[70vh] overflow-y-auto">
              {/* If Heading Edit */}
              {!selectedTestimonial && (
                <>
                  <Input
                    size="md"
                    label="Heading Title"
                    value={formData.heading.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heading: { ...formData.heading, title: e.target.value },
                      })
                    }
                  />

                  <Input
                    size="md"
                    label="Heading Subtitle"
                    value={formData.heading.subTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heading: {
                          ...formData.heading,
                          subTitle: e.target.value,
                        },
                      })
                    }
                  />

                  <Button
                    onClick={async () => {
                      setSaving(true);
                      toast.loading("Saving heading...", { id: "head" });

                      try {
                        const res = await fetch(
                          "/api/all-data/testimonialsection/update",
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(formData),
                          }
                        );

                        const json = await res.json();
                        if (!json.success) throw new Error(json.error);

                        toast.dismiss("head");
                        toast.success("Heading updated!");
                        setModalOpen(false);
                      } catch (err: any) {
                        toast.dismiss("head");
                        toast.error(err.message);
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    Save Heading
                  </Button>
                </>
              )}

              {/* If Testimonial Edit */}
              {selectedTestimonial && (
                <>
                  {selectedTestimonial.image && (
                    <span className="relative">
                      <img
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.name}
                        className="w-32 h-32 rounded-full object-cover border-2 border-amber-500 mb-2"
                      />
                      <button
                        className="absolute top-0 left-24 border rounded-full p-1 bg-white"
                        onClick={handleImageDelete}
                      >
                        <BsTrash3Fill className="text-rose-500 w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <Input
                    size="md"
                    type="text"
                    label="Name"
                    value={selectedTestimonial.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />

                  <select
                    value={selectedTestimonial.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="border p-2 rounded-lg dark:bg-gray-700"
                  >
                    <option value="">Select Role</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Developer">Developer</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>

                  <textarea
                    placeholder="Comment"
                    value={selectedTestimonial.comment}
                    onChange={(e) => handleChange("comment", e.target.value)}
                    className="border p-2 rounded-lg dark:bg-gray-700"
                  />

                  <Input
                    size="md"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  <Button onClick={handleModalSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </OpenModal>
        )}
      </div>
    </section>
  );
};
