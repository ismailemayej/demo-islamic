"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { Spinner } from "@heroui/spinner";
import { useGetSection } from "../Hook/GetData";

interface CertificateItem {
  id: string | number;
  degree: string;
  institution: string;
  board?: string;
  year?: string;
  gpa?: string;
}

export const CertificateSectionDashboard = () => {
  const { section, loading, error } = useGetSection("certificatesection");
  const [formData, setFormData] = useState({
    heading: { title: "", subTitle: "" },
    data: [] as CertificateItem[],
  });
  const [selectedItem, setSelectedItem] = useState<CertificateItem | null>(
    null
  );
  const [editingHeading, setEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Initial Data Load
  useEffect(() => {
    if (section) {
      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: section.data || [],
      });
    }
  }, [section]);

  // ✅ Save to DB (Full update)
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/certificatesection/update", {
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
    const exists = formData.data.some((a) => a.id === selectedItem.id);
    const updatedData = exists
      ? formData.data.map((a) => (a.id === selectedItem.id ? selectedItem : a))
      : [...formData.data, { ...selectedItem, id: Date.now() }];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedItem(null);
  };

  // ✅ Delete
  const handleDelete = (id: string | number) => {
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
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <section className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="flex items-center justify-between mb-8">
          {editingHeading ? (
            <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
              <Input
                size="md"
                label="Title"
                variant="bordered"
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
                label="Sub Title"
                variant="bordered"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heading: { ...formData.heading, subTitle: e.target.value },
                  })
                }
              />
              <div className="flex gap-2">
                <Button color="success" onClick={() => handleSave(formData)}>
                  Save
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => setEditingHeading(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Heading
                title={formData.heading.title}
                subTitle={formData.heading.subTitle}
              />
              <div className="flex gap-4 items-center">
                <IoAddCircleSharp
                  onClick={() =>
                    setSelectedItem({
                      id: Date.now(),
                      degree: "",
                      institution: "",
                      board: "",
                      year: "",
                      gpa: "",
                    })
                  }
                  className="text-green-500 cursor-pointer w-7 h-7"
                />
                <FaRegEdit
                  onClick={() => setEditingHeading(true)}
                  className="text-yellow-500 cursor-pointer w-6 h-6"
                />
              </div>
            </>
          )}
        </div>

        {/* Data Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {formData.data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  {item.degree || "Untitled"}
                </h3>
                <div className="flex gap-3 items-center">
                  <FaRegEdit
                    onClick={() => setSelectedItem(item)}
                    className="text-sky-500 cursor-pointer w-5 h-5"
                  />
                  <BsTrash3Fill
                    onClick={() => handleDelete(item.id)}
                    className="text-rose-500 cursor-pointer w-5 h-5"
                  />
                </div>
              </div>
              <p className="text-sm dark:text-white">
                <strong>Institution:</strong> {item.institution}
              </p>
              <p className="text-sm dark:text-white">
                <strong>Board:</strong> {item.board}
              </p>
              <p className="text-sm dark:text-white">
                <strong>Year:</strong> {item.year}
              </p>
              <p className="text-sm dark:text-white">
                <strong>GPA:</strong> {item.gpa}
              </p>

              <div className="absolute bottom-3 right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <OpenModal
          title={selectedItem.id ? "Edit Certificate" : "Add Certificate"}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          size="xl"
        >
          <div className="max-h-[80vh] overflow-y-auto space-y-4 p-3">
            <Input
              size="md"
              label="Degree"
              value={selectedItem.degree}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, degree: e.target.value })
              }
            />
            <Input
              size="md"
              label="Institution"
              value={selectedItem.institution}
              onChange={(e) =>
                setSelectedItem({
                  ...selectedItem,
                  institution: e.target.value,
                })
              }
            />
            <Input
              size="md"
              label="Board"
              value={selectedItem.board}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, board: e.target.value })
              }
            />
            <Input
              size="md"
              label="Year"
              value={selectedItem.year}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, year: e.target.value })
              }
            />
            <Input
              size="md"
              label="GPA"
              value={selectedItem.gpa}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, gpa: e.target.value })
              }
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button color="primary" onClick={handleModalSave}>
                Save
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </OpenModal>
      )}
    </section>
  );
};
