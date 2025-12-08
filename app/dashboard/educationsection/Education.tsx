"use client";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { GraduationCap, XCircle } from "lucide-react";
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
  id: number; // সব আইটেমে থাকা আবশ্যক
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

  const [editingHeading, setEditingHeading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Education | null>(null);
  const [saving, setSaving] = useState(false);

  // ✅ Initial Data Load
  useEffect(() => {
    if (section) {
      // যদি কোনো আইটেমে id না থাকে, generate করা হচ্ছে
      const dataWithId = (section.data || []).map((item: any, idx: number) => ({
        ...item,
        id: item.id || Date.now() + idx,
      }));

      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: dataWithId,
      });
    }
  }, [section]);

  // ✅ Save to DB (Full update)
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/educationsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      toast.dismiss("save");
      toast.success("✅ Updated Successfully!");
      setSelectedItem(null);
      setEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Modal Save (Add/Edit)
  const handleModalSave = () => {
    if (!selectedItem) return;

    let updatedData: Education[];
    if (formData.data.some((a) => a.id === selectedItem.id)) {
      // Update existing item
      updatedData = formData.data.map((a) =>
        a.id === selectedItem.id ? selectedItem : a
      );
    } else {
      // Add new item
      updatedData = [...formData.data, { ...selectedItem, id: Date.now() }];
    }

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  // ✅ Delete
  const handleDelete = (id: number) => {
    const updated = {
      ...formData,
      data: formData.data.filter((a) => a.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("🗑️ Deleted successfully");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">Loading...</div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <section className="py-16 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 text-center">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
            center
          />
        </div>

        <span className="flex gap-2 items-center">
          <button
            onClick={() => {
              setSelectedItem({
                id: Date.now(),
                examName: "",
                institution: "",
                board: "",
                year: "",
                result: "",
                duration: "",
              });
              setIsModalOpen(true);
            }}
            title="Add new"
          >
            <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
          </button>

          <button
            onClick={() => setEditingHeading(!editingHeading)}
            className="transition"
            title={editingHeading ? "Close heading editor" : "Edit heading"}
          >
            {editingHeading ? (
              <XCircle size={25} className="text-yellow-500" />
            ) : (
              <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
            )}
          </button>
        </span>
      </div>

      {/* Edit Heading */}
      {editingHeading && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg my-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Input
              size="md"
              type="text"
              value={formData.heading.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  heading: { ...prev.heading, title: e.target.value },
                }))
              }
              label="Title"
            />
            <Input
              size="md"
              type="text"
              value={formData.heading.subTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  heading: { ...prev.heading, subTitle: e.target.value },
                }))
              }
              label="Subtitle"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              color="primary"
              onPress={() => handleSave(formData)}
              disabled={saving}
            >
              Save Heading & All
            </Button>
          </div>
        </div>
      )}

      {/* Education Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {formData.data
          .slice()
          .reverse()
          .map((edu) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative p-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-amber-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-2 right-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedItem({ ...edu });
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="text-red-500 hover:text-red-700 transition"
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
                  <span className="font-semibold">Accademy:</span>{" "}
                  {edu.institution}
                </div>
                <div>
                  <span className="font-semibold">Board:</span> {edu.board}
                </div>
                <div>
                  <span className="font-semibold">Year:</span> {edu.year}
                </div>
                <div>
                  <span className="font-semibold">Result:</span> {edu.result}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span>{" "}
                  {edu.duration}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Modal */}
      <OpenModal
        title={
          selectedItem
            ? selectedItem.id
              ? "Update Education"
              : "Add Education"
            : ""
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        {selectedItem && (
          <ModalForm
            tempEducation={selectedItem}
            setTempEducation={setSelectedItem}
          />
        )}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            color="primary"
            onPress={() => setIsModalOpen(false)}
            variant="ghost"
          >
            Close
          </Button>
          <Button color="success" onPress={handleModalSave}>
            {selectedItem?.id ? "Update" : "Add"}
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
      label="Accademy"
      value={tempEducation.institution}
      onChange={(e) =>
        setTempEducation((prev: any) => ({
          ...prev,
          institution: e.target.value,
        }))
      }
    />
    <Input
      label="Board"
      value={tempEducation.board}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, board: e.target.value }))
      }
    />
    <Input
      label="Year"
      value={tempEducation.year}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, year: e.target.value }))
      }
    />
    <Input
      label="Result"
      value={tempEducation.result}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, result: e.target.value }))
      }
    />
    <Input
      label="Duration"
      value={tempEducation.duration}
      onChange={(e) =>
        setTempEducation((prev: any) => ({ ...prev, duration: e.target.value }))
      }
    />
  </div>
);
