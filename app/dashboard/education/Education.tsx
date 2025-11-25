"use client";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { GraduationCap, Save, XCircle } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { Input } from "@heroui/input";
import { IoAddCircleSharp } from "react-icons/io5";

import { Button } from "@nextui-org/react";
import { OpenModal } from "@/components/Modal";

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
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [tempEducation, setTempEducation] = useState<Education>({
    examName: "",
    institution: "",
    board: "",
    year: "",
    result: "",
    duration: "",
  });

  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // -------------------- Heading change handler ----------------
  const handleHeadingChange = (field: "title" | "subTitle", value: string) => {
    setFormData((prev) => ({
      ...prev,
      heading: { ...prev.heading, [field]: value },
    }));
    setHasUnsavedChanges(true);
  };

  // -------------------- ADD NEW -----------------------
  const openAddModal = () => {
    setTempEducation({
      examName: "",
      institution: "",
      board: "",
      year: "",
      result: "",
      duration: "",
    });
    setIsAddModal(true);
  };

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [...prev.data, tempEducation],
    }));
    setIsAddModal(false);
    setHasUnsavedChanges(true);
    toast.success("Added new education item (local).");
  };

  // -------------------- EDIT --------------------------
  const openEditModal = (index: number) => {
    setEditIndex(index);
    setTempEducation({ ...formData.data[index] });
    setIsEditModal(true);
  };

  const handleEditSave = () => {
    if (editIndex === null) return;

    const newData = [...formData.data];
    newData[editIndex] = tempEducation;

    setFormData((prev) => ({ ...prev, data: newData }));
    setIsEditModal(false);
    setEditIndex(null);
    setHasUnsavedChanges(true);
    toast.success("Edited item (local).");
  };

  // -------------------- DELETE -------------------------
  const handleDelete = (index: number) => {
    const newData = [...formData.data];
    newData.splice(index, 1);
    setFormData((prev) => ({ ...prev, data: newData }));
    setHasUnsavedChanges(true);
    toast.success("Item removed (local).");
  };

  // -------------------- SAVE TO BACKEND ----------------
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
      setHasUnsavedChanges(false);
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

        <span className="flex gap-2 items-center">
          <button onClick={openAddModal} title="Add new">
            <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
          </button>

          <button
            onClick={() => setEditingSection(!editingSection)}
            className="transition"
            title={editingSection ? "Close heading editor" : "Edit heading"}
          >
            {editingSection ? (
              <XCircle size={25} className="text-yellow-500" />
            ) : (
              <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
            )}
          </button>
        </span>
      </div>

      {/* Edit Heading */}
      {editingSection && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg my-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Input
              size="md"
              type="text"
              value={formData.heading.title}
              onChange={(e) => handleHeadingChange("title", e.target.value)}
              label="Title"
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400"
            />
            <Input
              size="md"
              type="text"
              value={formData.heading.subTitle}
              onChange={(e) => handleHeadingChange("subTitle", e.target.value)}
              label="Subtitle"
              className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditingSection(false)}
              className="px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-md bg-amber-500 text-white"
            >
              {saving ? "Saving..." : "Save Heading & All"}
            </button>
          </div>
        </div>
      )}

      {/* Education Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {formData.data?.reverse()?.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            className="relative p-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-amber-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => openEditModal(index)}
                className="text-blue-500 hover:text-blue-700 transition"
                title="Edit item"
              >
                <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete item"
              >
                <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              <h3 className="bangla text-lg font-semibold text-amber-800 dark:text-amber-400">
                {edu.examName || "—"}
              </h3>
            </div>

            <div className="space-y-2 text-gray-700 dark:text-gray-300 bangla">
              <div>
                <span className="text-amber-700 dark:text-amber-500 font-semibold">
                  প্রতিষ্ঠান:
                </span>{" "}
                {edu.institution || "—"}
              </div>
              <div>
                <span className="text-amber-700 dark:text-amber-500 font-semibold">
                  বোর্ড:
                </span>{" "}
                {edu.board || "—"}
              </div>
              <div>
                <span className="text-amber-700 dark:text-amber-500 font-semibold">
                  সাল:
                </span>{" "}
                {edu.year || "—"}
              </div>
              <div>
                <span className="text-amber-700 dark:text-amber-500 font-semibold">
                  রেজাল্ট:
                </span>{" "}
                {edu.result || "—"}
              </div>
              <div>
                <span className="text-amber-700 dark:text-amber-500 font-semibold">
                  সময়:
                </span>{" "}
                {edu.duration || "—"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button (shown only when unsaved changes exist) */}
      {hasUnsavedChanges && (
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

      {/* ---------------- Add Modal ----------------- */}
      <OpenModal
        title="নতুন শিক্ষা তথ্য যোগ করুন"
        isOpen={isAddModal}
        onClose={() => setIsAddModal(false)}
        size="lg"
      >
        <ModalForm
          tempEducation={tempEducation}
          setTempEducation={setTempEducation}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button
            color="primary"
            onPress={() => setIsAddModal(false)}
            variant="ghost"
          >
            Close
          </Button>
          <Button color="success" onPress={handleAdd}>
            Add
          </Button>
        </div>
      </OpenModal>

      {/* ---------------- Edit Modal ---------------- */}
      <OpenModal
        title="শিক্ষা তথ্য সম্পাদনা"
        isOpen={isEditModal}
        onClose={() => setIsEditModal(false)}
        size="lg"
      >
        <ModalForm
          tempEducation={tempEducation}
          setTempEducation={setTempEducation}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button
            color="primary"
            onPress={() => setIsEditModal(false)}
            variant="ghost"
          >
            Close
          </Button>
          <Button color="warning" onPress={handleEditSave}>
            Update
          </Button>
        </div>
      </OpenModal>
    </section>
  );
};

// ---------------- REUSABLE FORM ----------------
const ModalForm = ({
  tempEducation,
  setTempEducation,
}: {
  tempEducation: Education;
  setTempEducation: any;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Input
      label="পরীক্ষার নাম"
      value={tempEducation.examName}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, examName: e.target.value }))
      }
    />
    <Input
      label="প্রতিষ্ঠান"
      value={tempEducation.institution}
      onChange={(e) =>
        setTempEducation((prev: any) => ({
          ...prev,
          institution: e.target.value,
        }))
      }
    />
    <Input
      label="বোর্ড"
      value={tempEducation.board}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, board: e.target.value }))
      }
    />
    <Input
      label="সাল"
      value={tempEducation.year}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, year: e.target.value }))
      }
    />
    <Input
      label="রেজাল্ট"
      value={tempEducation.result}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, result: e.target.value }))
      }
    />
    <Input
      label="সময়"
      value={tempEducation.duration}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, duration: e.target.value }))
      }
    />
  </div>
);
