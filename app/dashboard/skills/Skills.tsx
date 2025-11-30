"use client";
import { useEffect, useState } from "react";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Button, Input, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { FaRegEdit } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { BsTrash3Fill } from "react-icons/bs";
import { OpenModal } from "@/components/Modal";
import Background from "@/components/background";
import { useGetSection } from "../Hook/GetData";
import { SkillItem, TSkillSection } from "@/types/all-types";

const gradients = [
  "from-red-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-green-400 to-lime-500",
  "from-purple-400 to-violet-500",
  "from-pink-400 to-rose-500",
  "from-orange-400 to-yellow-500",
  "from-teal-400 to-cyan-500",
  "from-fuchsia-400 to-purple-500",
];

const SkillsDashboardSection: React.FC = () => {
  const { section, loading, error } =
    useGetSection<TSkillSection>("skillsection");

  const [formData, setFormData] = useState<TSkillSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        heading: {
          title: section.heading?.title || "",
          subTitle: section.heading?.subTitle || "",
        },
        data: section.data && Array.isArray(section.data) ? section.data : [],
      });
    }
  }, [section]);

  // ✅ Save to DB
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch(`/api/all-data/skillsection/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setSelectedSkill(null);
      setIsEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add new skill
  const handleAdd = () => {
    const newItem: SkillItem = {
      id: Date.now(),
      name: "New Skill",
      lavel: 50,
    };
    setSelectedSkill(newItem);
  };

  // ✅ Delete skill
  const handleDelete = (id: number) => {
    const updated = {
      ...formData,
      data: formData.data.filter((a) => a.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("Deleted successfully!");
  };

  // ✅ Save edited/added skill
  const handleModalSave = () => {
    if (!selectedSkill) return;
    const exists = formData.data.some((a) => a.id === selectedSkill.id);
    const updatedData = exists
      ? formData.data.map((a) =>
          a.id === selectedSkill.id ? selectedSkill : a
        )
      : [...formData.data, selectedSkill];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedSkill(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center py-10">
        {error || "Something went wrong!"}
      </p>
    );

  return (
    <Background id="skills-dashboard">
      {/* Heading and Add/Edit Buttons */}
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex-1 text-center">
          <Heading
            title={formData.heading.title || "My Skills"}
            subTitle={formData.heading.subTitle || "All my skills"}
          />
        </div>
        <div className="flex align-bottom gap-3">
          <IoAddCircleSharp
            className="text-green-500 cursor-pointer w-7 h-7"
            onClick={handleAdd}
          />
          <FaRegEdit
            className="text-yellow-500 cursor-pointer w-7 h-6"
            onClick={() => setIsEditingHeading(true)}
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {formData.data.map((skill, index) => {
          const color = gradients[index % gradients.length];
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-emerald-50 dark:bg-gray-800 dark:shadow-gray-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 relative"
            >
              {/* Skill Name & Level */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold dark:text-white text-gray-700">
                  {skill.name}
                </span>
                <span className="text-sm font-medium dark:text-white text-gray-500">
                  {skill.lavel}%
                </span>
              </div>

              {/* Skill Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
                  style={{ width: `${skill.lavel}%` }}
                ></div>
              </div>

              {/* Edit/Delete Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 mb-9">
                <FaRegEdit
                  className="text-yellow-500 cursor-pointer w-6 h-6"
                  onClick={() => setSelectedSkill(skill)}
                />
                <BsTrash3Fill
                  className="text-rose-500 cursor-pointer w-6 h-5"
                  onClick={() => handleDelete(skill.id)}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit/Add Skill Modal */}
      {selectedSkill && (
        <OpenModal
          title={`Edit: ${selectedSkill.name}`}
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
          size="xl"
        >
          <div className="max-h-[80vh] overflow-y-auto space-y-4 p-3">
            <Input
              size="md"
              label="Skill Name"
              value={selectedSkill.name}
              onChange={(e) =>
                setSelectedSkill({ ...selectedSkill, name: e.target.value })
              }
            />
            <Input
              size="md"
              label="Level"
              type="number"
              value={String(selectedSkill.lavel)}
              onChange={(e) =>
                setSelectedSkill({
                  ...selectedSkill,
                  lavel: Number(e.target.value),
                })
              }
            />
            <div className="flex justify-end gap-3">
              <Button color="primary" onClick={handleModalSave}>
                Save
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </OpenModal>
      )}

      {/* Edit Heading Modal */}
      {isEditingHeading && (
        <OpenModal
          title="Edit Heading"
          isOpen={isEditingHeading}
          onClose={() => setIsEditingHeading(false)}
          size="lg"
        >
          <div className="max-h-[70vh] overflow-y-auto space-y-4 p-4">
            <Input
              size="md"
              label="Title"
              value={formData.heading.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  heading: { ...prev.heading, title: e.target.value },
                }))
              }
            />
            <Input
              size="md"
              label="Sub Title"
              value={formData.heading.subTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  heading: { ...prev.heading, subTitle: e.target.value },
                }))
              }
            />
            <div className="flex justify-end gap-3">
              <Button
                color="primary"
                onClick={() => handleSave()}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={() => setIsEditingHeading(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </OpenModal>
      )}
    </Background>
  );
};

export default SkillsDashboardSection;
