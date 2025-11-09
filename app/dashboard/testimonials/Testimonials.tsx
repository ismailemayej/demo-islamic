"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Trash2, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";

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

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          name: "",
          role: "",
          comment: "",
          image: "",
        },
      ],
    }));
  };

  const handleDelete = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.data];
      updated.splice(index, 1);
      return { ...prev, data: updated };
    });
  };

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

  const handleImageDelete = async (index: number) => {
    const imageUrl = formData.data[index].image;
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

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/testimonialsection/update", {
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

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 bangla transition-colors duration-500">
      <div className="container mx-auto px-0">
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

        {editing && (
          <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 mb-10">
            {/* Heading */}
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

            {/* Testimonials */}
            <div className="space-y-4">
              {formData.data.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-emerald-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 grid sm:grid-cols-2 gap-4 items-center"
                >
                  <button
                    onClick={() => handleDelete(i)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={testimonial.name}
                      onChange={(e) =>
                        handleChange("data", "name", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={testimonial.name}
                        onChange={(e) =>
                          handleChange("data", "name", e.target.value, i)
                        }
                        className="border p-2 rounded-lg dark:bg-gray-700"
                      />

                      {/* ✅ Role as Dropdown */}
                      <select
                        value={testimonial.role}
                        onChange={(e) =>
                          handleChange("data", "role", e.target.value, i)
                        }
                        className="border p-2 rounded-lg dark:bg-gray-700"
                      >
                        <option value="">Select Profession</option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Developer">Developer</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>

                      <textarea
                        placeholder="Comment"
                        value={testimonial.comment}
                        onChange={(e) =>
                          handleChange("data", "comment", e.target.value, i)
                        }
                        className="border p-2 rounded-lg dark:bg-gray-700"
                      />
                    </div>

                    <textarea
                      placeholder="Comment"
                      value={testimonial.comment}
                      onChange={(e) =>
                        handleChange("data", "comment", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {testimonial.image ? (
                      <>
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-32 h-32 object-cover rounded-full border-2 border-amber-500"
                        />
                        <button
                          onClick={() => handleImageDelete(i)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          Delete Image
                        </button>
                      </>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, i)}
                        className="border p-2 rounded-lg dark:bg-gray-700"
                      />
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
                <Plus size={18} /> Add Testimonial
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Display */}
        <div className="mt-3 grid gap-8 md:grid-cols-4">
          {formData.data.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 flex-1">
                {testimonial.comment}
              </p>
              <div className="mt-4 text-amber-500 text-2xl self-end">🕌</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
