"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Edit, Save, Trash2, X } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import toast from "react-hot-toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Heading } from "@/components/Heading";
import { DraggableList } from "../Hook/DraggableList";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  board?: string;
  year?: string;
  gpa?: string;
}

interface EducationSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: EducationItem[];
}

export const CertificateSectionDashboard: React.FC = () => {
  const { section } = useGetSection("certificatesection");
  const [formData, setFormData] = useState<EducationSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load section data
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

  // Handle field changes
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
      setFormData((prev) => {
        const newData = [...prev.data];
        newData[index] = { ...newData[index], [field]: value };
        return { ...prev, data: newData };
      });
    }
  };

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/certificatesection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setEditingIndex(null);
      setEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete one item
  const handleDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index),
    }));
  };

  // Add new item
  const addNewEducation = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          degree: "",
          institution: "",
          board: "",
          year: "",
          gpa: "",
        },
      ],
    }));
    setEditingIndex(formData.data.length);
  };

  return (
    <section
      id="education"
      className="py-10 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white 
      dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto">
        {/* ======= Section Heading ======= */}
        <div className="flex items-center justify-between mb-8">
          {editingHeading ? (
            <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
              <Input
                label="Title"
                variant="bordered"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
              />
              <Input
                label="Sub Title"
                variant="bordered"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
              />
              <div className="flex gap-2">
                <Button
                  color="success"
                  variant="solid"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => setEditingHeading(false)}
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Heading
                title={formData.heading.title}
                subTitle={formData.heading.subTitle}
              />
              <div className="flex gap-3">
                <Button
                  color="primary"
                  variant="flat"
                  onClick={addNewEducation}
                >
                  ➕ Add
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  onClick={() => setEditingHeading(true)}
                >
                  ✏️ Edit Heading
                </Button>
              </div>
            </>
          )}
        </div>

        {/* ======= Education Cards ======= */}
        <DraggableList<EducationItem>
          items={formData.data}
          getId={(item) => item.id}
          onChange={(newItems) =>
            setFormData((prev) => ({ ...prev, data: newItems }))
          }
          className="grid gap-6 md:grid-cols-3"
          renderItem={(edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
        rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 cursor-grab active:cursor-grabbing"
            >
              {editingIndex === index ? (
                <div className="space-y-3">
                  <Input
                    label="Degree"
                    variant="bordered"
                    value={edu.degree}
                    onChange={(e) =>
                      handleChange("data", "degree", e.target.value, index)
                    }
                  />
                  <Input
                    label="Institution"
                    variant="bordered"
                    value={edu.institution}
                    onChange={(e) =>
                      handleChange("data", "institution", e.target.value, index)
                    }
                  />
                  <Input
                    label="Board"
                    variant="bordered"
                    value={edu.board}
                    onChange={(e) =>
                      handleChange("data", "board", e.target.value, index)
                    }
                  />
                  <Input
                    label="Year"
                    variant="bordered"
                    value={edu.year}
                    onChange={(e) =>
                      handleChange("data", "year", e.target.value, index)
                    }
                  />
                  <Input
                    label="GPA"
                    variant="bordered"
                    value={edu.gpa}
                    onChange={(e) =>
                      handleChange("data", "gpa", e.target.value, index)
                    }
                  />

                  <div className="flex gap-2 mt-3">
                    <Button
                      color="success"
                      variant="solid"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={() => setEditingIndex(null)}
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      {edu.degree}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        color="warning"
                        variant="flat"
                        onClick={() => setEditingIndex(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Institution:</strong> {edu.institution}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Board:</strong> {edu.board}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>Year:</strong> {edu.year}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <strong>GPA:</strong> {edu.gpa}
                  </p>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-3 right-3 bg-amber-500 dark:bg-amber-400 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Award className="w-4 h-4" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        />
      </div>
    </section>
  );
};
