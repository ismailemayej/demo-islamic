"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { GraduationCap, Trash2, Plus, Save, Edit3, X } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const prevData = (data: Education[]) => JSON.parse(JSON.stringify(data));

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
      const newData = [...prevData(formData.data)];
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
    setFormData((prev) => {
      const newData = [...prev.data];
      newData.splice(index, 1);
      return { ...prev, data: newData };
    });
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
      setEditing(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="education"
      className="py-16 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="flex justify-between items-center">
        <Heading
          title={formData.heading.title}
          subTitle={formData.heading.subTitle}
          center
        />
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            editing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {editing ? (
            <>
              <X size={18} /> Cancel
            </>
          ) : (
            <>
              <Edit3 size={18} /> Edit
            </>
          )}
        </button>
      </div>

      {editing && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg my-6">
          <h3 className="text-lg font-bold text-amber-700 mb-4">
            🎓 Edit Education Section
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="w-full border rounded-lg p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="w-full border rounded-lg p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={16} /> Add New Education
          </button>
        </div>
      )}

      <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {formData.data.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative p-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-amber-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            {editing && (
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              {editing ? (
                <input
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
                    {editing ? (
                      <input
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
        ))}
      </div>

      {editing && (
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
