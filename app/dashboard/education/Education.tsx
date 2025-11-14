"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Trash2,
  Plus,
  Save,
  Edit3,
  X,
  XCircle,
} from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { Input } from "@heroui/input";

interface Education {
  examName: string;
  institution: string;
  board: string;
  year: string;
  result: string;
  duration: string;
}

interface EducationSectionData {
  heading: { title: string; subTitle: string };
  data: Education[];
}

export const EducationSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("educationsection");

  const [formData, setFormData] = useState<EducationSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [editingSection, setEditingSection] = useState(false);
  const [saving, setSaving] = useState(false);

  // Track which card is being edited individually
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

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
      const newData = [...formData.data];
      newData[index] = { ...newData[index], [field]: value };
      setFormData((prev) => ({ ...prev, data: newData }));
    }
  };

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          examName: "",
          institution: "",
          board: "",
          year: "",
          result: "",
          duration: "",
        },
      ],
    }));
  };

  const handleDelete = (index: number) => {
    const newData = [...formData.data];
    newData.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: newData }));
    if (editingCardIndex === index) setEditingCardIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/educationsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setEditingSection(false);
      setEditingCardIndex(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <section className="py-16 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Heading
          title={formData.heading.title}
          subTitle={formData.heading.subTitle}
          center
        />
        <button onClick={() => setEditingSection(!editingSection)}>
          {editingSection ? (
            <>
              <XCircle size={25} className="text-yellow-500" />
            </>
          ) : (
            <>
              <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
            </>
          )}
        </button>
      </div>

      {/* Edit Heading */}
      {editingSection && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg my-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Input
              size="md"
              type="text"
              value={formData.heading.title}
              onChange={(e) => handleChange("heading", "title", e.target.value)}
              label="Title"
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400"
            />
            <Input
              size="md"
              type="text"
              value={formData.heading.subTitle}
              onChange={(e) =>
                handleChange("heading", "subTitle", e.target.value)
              }
              label="Subtitle"
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={16} />
            Add New Education
          </button>
        </div>
      )}

      {/* Education Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {formData.data.map((edu, index) => {
          const isEditingCard = editingCardIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative p-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-amber-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              {/* Card Edit/Delete Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() =>
                    setEditingCardIndex(isEditingCard ? null : index)
                  }
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="text-amber-600 dark:text-amber-400 w-6 h-6" />
                {isEditingCard ? (
                  <Input
                    size="md"
                    type="text"
                    value={edu.examName}
                    onChange={(e) =>
                      handleChange("data", "examName", e.target.value, index)
                    }
                    className="w-full border-b border-gray-300 bg-transparent dark:text-white focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <h3 className="bangla text-lg font-semibold text-amber-800 dark:text-amber-400">
                    {edu.examName}
                  </h3>
                )}
              </div>

              <div className="space-y-2 text-gray-700 dark:text-gray-300 bangla">
                {["institution", "board", "year", "result", "duration"].map(
                  (field) => (
                    <div key={field}>
                      <span className="text-amber-700 dark:text-amber-500 font-semibold">
                        {field === "institution"
                          ? "প্রতিষ্ঠান:"
                          : field === "board"
                            ? "বোর্ড:"
                            : field === "year"
                              ? "সাল:"
                              : field === "result"
                                ? "রেজাল্ট:"
                                : "সময়:"}
                      </span>{" "}
                      {isEditingCard ? (
                        <Input
                          size="md"
                          type="text"
                          value={(edu as any)[field]}
                          onChange={(e) =>
                            handleChange("data", field, e.target.value, index)
                          }
                          className="border-b border-gray-300 bg-transparent dark:text-white w-3/4 focus:outline-none focus:border-amber-400"
                        />
                      ) : (
                        (edu as any)[field]
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      {(editingSection || editingCardIndex !== null) && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 shadow-md hover:shadow-lg transition"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
};
