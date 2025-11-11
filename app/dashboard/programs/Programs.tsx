"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Program {
  id: string;
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

interface ProgramSectionData {
  heading: { title: string; subTitle: string };
  data: Program[];
}

export const ProgramsSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("programsection");

  const [formData, setFormData] = useState<ProgramSectionData>({
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
          programName: "",
          name: "",
          location: "",
          date: "",
          day: "",
        },
      ],
    }));
  };

  const handleDelete = (index: number) => {
    const updated = [...formData.data];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: updated }));
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/programsection/update", {
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

  const today = new Date();
  const calculateRemainingDays = (programDate: Date) => {
    const diffTime = programDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} দিন বাকি`;
    if (diffDays === 1) return "আগামীকাল";
    if (diffDays === 0) return "আজই অনুষ্ঠিত হবে";
    return "সম্পন্ন হয়েছে";
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
    <section
      id="programs"
      className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900"
    >
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

        {/* ---------- Edit Panel ---------- */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700 mb-10 space-y-4">
            <h3 className="text-lg font-semibold text-amber-700">
              ✏️ Edit Programs Section
            </h3>

            {/* Heading Inputs */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4 p-3">
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

            {/* Program Items */}
            <div className=" grid lg:grid-cols-3 grid-cols-1 gap-4 bg-amber-100 p-2 rounded-xl">
              {formData.data.map((program, i) => (
                <motion.div
                  key={program.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative bg-gradient-to-r from-amber-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => handleDelete(i)}
                    className=" border p-1 rounded-2xl bg-white absolute z-10 top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid sm:grid-cols-1 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Program Name"
                      value={program.programName}
                      onChange={(e) =>
                        handleChange("data", "programName", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={program.name}
                      onChange={(e) =>
                        handleChange("data", "name", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Location"
                      value={program.location}
                      onChange={(e) =>
                        handleChange("data", "location", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="date"
                      placeholder="Date"
                      value={program.date}
                      onChange={(e) =>
                        handleChange("data", "date", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="number"
                      placeholder="Day"
                      value={program.day}
                      onChange={(e) =>
                        handleChange("data", "day", e.target.value, i)
                      }
                      className="border p-2 rounded-lg dark:bg-gray-700"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex justify-between items-center">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus size={18} /> Add Program
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

        {/* ---------- Display Programs ---------- */}
        <div className="grid gap-6 md:grid-cols-4 mt-10">
          {formData.data.map((program, index) => {
            const programDate = new Date(program.date);
            const diffTime = programDate.getTime() - new Date().getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isUpcoming = diffDays >= 0;
            const remainingDays =
              diffDays > 1
                ? `${diffDays} দিন বাকি`
                : diffDays === 1
                  ? "আগামীকাল"
                  : diffDays === 0
                    ? "আজই অনুষ্ঠিত হবে"
                    : "সম্পন্ন হয়েছে";

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-500 text-xl">🕌</span>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {program.programName}
                  </h3>
                </div>

                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">নামঃ</span> {program.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">স্থানঃ</span>{" "}
                    {program.location}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">তারিখঃ</span> {program.date}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">বারঃ</span> {program.day}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-auto w-full py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold ${
                    isUpcoming
                      ? "bg-emerald-600 text-white dark:bg-emerald-500"
                      : "bg-gray-400 text-white dark:bg-gray-600"
                  }`}
                >
                  {isUpcoming ? `⏱ ${remainingDays}` : `✅ ${remainingDays}`}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
