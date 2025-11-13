"use client";
import { useEffect, useState } from "react";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Button, Input, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { Edit3, Trash2, Plus } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { OpenModal } from "@/components/Modal";

interface Achievement {
  id: string;
  title: string;
  count: number;
  icon: string;
}

export const AchievementsDashboard = () => {
  const { section, loading, error } = useGetSection<any>("achievementsection");

  const [formData, setFormData] = useState({
    heading: { title: "", subTitle: "" },
    data: [] as Achievement[],
  });

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
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

  // ✅ Save to DB
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/achievementsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setSelectedAchievement(null);
      setIsEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Add new achievement
  const handleAdd = () => {
    const newItem: Achievement = {
      id: Date.now().toString(),
      title: "New Achievement",
      count: 0,
      icon: "🏆",
    };
    setSelectedAchievement(newItem);
  };

  // ✅ Delete item
  const handleDelete = (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((a) => a.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("Deleted successfully!");
  };

  // ✅ Save (modal) edited achievement
  const handleModalSave = () => {
    if (!selectedAchievement) return;
    const exists = formData.data.some((a) => a.id === selectedAchievement.id);
    const updatedData = exists
      ? formData.data.map((a) =>
          a.id === selectedAchievement.id ? selectedAchievement : a
        )
      : [...formData.data, selectedAchievement];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedAchievement(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <Background id="achievement-dashboard">
      <div className="flex justify-between items-center mb-6">
        <Heading
          title={formData.heading.title || "Achievements"}
          subTitle={formData.heading.subTitle || "Our proud moments"}
        />
        <div className="flex gap-3">
          <Button color="secondary" onClick={() => setIsEditingHeading(true)}>
            <Edit3 size={16} /> Edit Heading
          </Button>
          <Button color="success" onClick={handleAdd}>
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>

      {/* ✅ Grid Section */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {formData.data.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20, rotateY: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 relative group"
          >
            {/* 3D Animated Icon */}
            <motion.div
              initial={{ rotateY: 0 }}
              whileHover={{ rotateY: 360 }}
              transition={{ duration: 1 }}
              className="text-5xl mb-4 text-amber-500 flex justify-center"
            >
              {/* <Layers3D className="w-10 h-10" /> */}
              {achievement.icon}
            </motion.div>

            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 text-center">
              {achievement.count}+
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-center mt-2">
              {achievement.title}
            </p>

            {/* Edit/Delete 3D buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <motion.button
                onClick={() => setSelectedAchievement(achievement)}
                whileHover={{ scale: 1.2 }}
                className="bg-emerald-100 text-emerald-600 rounded-full p-2 shadow-md"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => handleDelete(achievement.id)}
                whileHover={{ scale: 1.2 }}
                className="bg-red-100 text-red-600 rounded-full p-2 shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Edit Achievement Modal */}
      {selectedAchievement && (
        <OpenModal
          title={`Edit: ${selectedAchievement.title}`}
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          size="xl"
        >
          <div className="max-h-[80vh] overflow-y-auto space-y-4 p-3">
            <Input
              label="Title"
              value={selectedAchievement.title}
              onChange={(e) =>
                setSelectedAchievement({
                  ...selectedAchievement,
                  title: e.target.value,
                })
              }
            />
            <Input
              label="Count"
              type="number"
              value={String(selectedAchievement.count)}
              onChange={(e) =>
                setSelectedAchievement({
                  ...selectedAchievement,
                  count: Number(e.target.value),
                })
              }
            />
            <Input
              label="Icon"
              value={selectedAchievement.icon}
              onChange={(e) =>
                setSelectedAchievement({
                  ...selectedAchievement,
                  icon: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <Button color="primary" onClick={handleModalSave}>
                Save Changes
              </Button>
              <Button
                color="danger"
                variant="flat"
                onClick={() => setSelectedAchievement(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </OpenModal>
      )}

      {/* ✅ Heading Edit Modal */}
      {isEditingHeading && (
        <OpenModal
          title="Edit Heading"
          isOpen={isEditingHeading}
          onClose={() => setIsEditingHeading(false)}
          size="lg"
        >
          <div className="max-h-[70vh] overflow-y-auto space-y-4 p-4">
            <Input
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
