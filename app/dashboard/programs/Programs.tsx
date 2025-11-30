"use client";

import { Heading } from "@/components/Heading";
import { useGetSection } from "../Hook/GetData";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { Plus, Trash2, Save, Edit3, X, XCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { Input } from "@heroui/input";

interface Program {
  id: number | string;
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

interface HeadingType {
  title: string;
  subTitle: string;
}

interface FormData {
  heading: HeadingType;
  data: Program[];
}

export const ProgramsSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("programsection");

  const [formData, setFormData] = useState<FormData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Load API data
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

  // ✅ Save all data to DB
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/programsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setSelectedProgram(null);
      setIsEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add new program
  const handleAdd = () => {
    const newProgram: Program = {
      id: Date.now(),
      programName: "",
      name: "",
      location: "",
      date: "",
      day: "",
    };
    setSelectedProgram(newProgram);
    setModalOpen(true);
  };

  // ✅ Delete program
  const handleDelete = (id: number | string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((p) => p.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("Deleted successfully!");
  };

  // ✅ Save modal program
  const handleModalSave = () => {
    if (!selectedProgram) return;
    const exists = formData.data.some((p) => p.id === selectedProgram.id);
    const updatedData = exists
      ? formData.data.map((p) =>
          p.id === selectedProgram.id ? selectedProgram : p
        )
      : [...formData.data, selectedProgram];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedProgram(null);
    setModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900">
      <div className="container mx-auto">
        {/* ---------- Heading ---------- */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 text-center">
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
            />
          </div>
          <span className="flex justify-center gap-3">
            <button onClick={handleAdd}>
              <IoAddCircleSharp className="text-green-500 cursor-pointer w-7 h-7" />
            </button>
            <button onClick={() => setIsEditingHeading(!isEditingHeading)}>
              {isEditingHeading ? (
                <>
                  <XCircle size={25} className="text-yellow-500" />
                </>
              ) : (
                <>
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
                </>
              )}
            </button>
          </span>
        </div>

        {isEditingHeading && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <Input
              size="md"
              type="text"
              value={formData.heading.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heading: { ...formData.heading, title: e.target.value },
                })
              }
              label="Section Title"
              className="border p-2 rounded-lg w-full mb-2 dark:bg-gray-700"
            />
            <Input
              size="md"
              type="text"
              value={formData.heading.subTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heading: { ...formData.heading, subTitle: e.target.value },
                })
              }
              label="Section Subtitle"
              className="border p-2 rounded-lg w-full dark:bg-gray-700"
            />
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Heading"}
            </button>
          </div>
        )}

        {/* ---------- Programs List ---------- */}
        <div className="grid gap-6 md:grid-cols-4 mt-4">
          {formData.data?.reverse()?.map((program) => {
            const programDate = new Date(program.date);
            const diffTime = programDate.getTime() - new Date().getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const remainingDays =
              diffDays > 1
                ? `${diffDays} days left`
                : diffDays === 1
                  ? "Tomorrow"
                  : diffDays === 0
                    ? "It will be held today"
                    : "Completed";
            const isUpcoming = diffDays >= 0;

            return (
              <div
                key={program.id}
                className="dark:text-white bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="flex justify-between items-start mb-2 ">
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {program.programName || "নতুন প্রোগ্রাম"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProgram(program);
                        setModalOpen(true);
                      }}
                    >
                      <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
                    </button>
                    <button onClick={() => handleDelete(program.id)}>
                      <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p>
                  <span className="font-semibold dark:text-white">নাম </span>{" "}
                  {program.name}
                </p>
                <p>
                  <span className="font-semibold dark:text-white">স্থান </span>{" "}
                  {program.location}
                </p>
                <p>
                  <span className="font-semibold dark:text-white"> </span>{" "}
                  {program.date}
                </p>
                <p>
                  <span className="font-semibold dark:text-white">বার </span>{" "}
                  {program.day}
                </p>
                <div
                  className={`mt-3 w-full py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-md font-semibold ${isUpcoming ? "bg-emerald-700 text-white dark:bg-emerald-700" : "bg-gray-400 text-white dark:bg-gray-600"}`}
                >
                  {isUpcoming ? `⏱ ${remainingDays}` : `✅ ${remainingDays}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Modal ---------- */}
        {modalOpen && selectedProgram && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold mb-4 dark:text-white">
                {selectedProgram.id ? "Edit Program" : "Add Program"}
              </h3>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto dark:text-white">
                <Input
                  size="md"
                  type="text"
                  label="Program Name"
                  value={selectedProgram.programName}
                  onChange={(e) =>
                    setSelectedProgram({
                      ...selectedProgram,
                      programName: e.target.value,
                    })
                  }
                  className=" border p-2 rounded-lg w-full dark:bg-gray-700"
                />
                <Input
                  size="md"
                  type="text"
                  label="Name"
                  value={selectedProgram.name}
                  onChange={(e) =>
                    setSelectedProgram({
                      ...selectedProgram,
                      name: e.target.value,
                    })
                  }
                  className="dark:text-white border p-2 rounded-lg w-full dark:bg-gray-700"
                />
                <Input
                  size="md"
                  type="text"
                  label="Location"
                  value={selectedProgram.location}
                  onChange={(e) =>
                    setSelectedProgram({
                      ...selectedProgram,
                      location: e.target.value,
                    })
                  }
                  className="border p-2 dark:text-white rounded-lg w-full dark:bg-gray-700"
                />
                <Input
                  size="md"
                  type="date"
                  label="Date"
                  value={selectedProgram.date}
                  onChange={(e) =>
                    setSelectedProgram({
                      ...selectedProgram,
                      date: e.target.value,
                    })
                  }
                  className="dark:text-white border p-2 rounded-lg w-full dark:bg-gray-700"
                />
                <Input
                  size="md"
                  type="text"
                  label="Day"
                  value={selectedProgram.day}
                  onChange={(e) =>
                    setSelectedProgram({
                      ...selectedProgram,
                      day: e.target.value,
                    })
                  }
                  className="dark:text-white border p-2 rounded-lg w-full dark:bg-gray-700"
                />
              </div>
              <button
                onClick={handleModalSave}
                className="mt-4 w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Program
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
