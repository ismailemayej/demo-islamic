"use client";
import { useEffect, useState } from "react";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Button, Input, Card, CardBody, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { Edit3, Check, X, Plus, Trash2 } from "lucide-react";
import { useGetSection } from "../Hook/GetData";

interface Achievement {
  id: string;
  title: string;
  count: number;
  icon: string;
}
export const AchievementsDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection<any>("achievementsection");

  const [formData, setFormData] = useState({
    heading: { title: "", subTitle: "" },
    data: [] as Achievement[],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Load data when section updates
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
    value: string | number,
    index?: number
  ) => {
    if (sectionType === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: { ...prev.heading, [field]: value },
      }));
    } else if (sectionType === "data" && index !== undefined) {
      setFormData((prev) => {
        const newData = [...prevData(prev.data)];
        newData[index] = { ...newData[index], [field]: value };
        return { ...prev, data: newData };
      });
    }
  };
  const prevData = (data: Achievement[]) => JSON.parse(JSON.stringify(data));

  // ✅ Add new achievement
  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          title: "New Achievement",
          count: 0,
          icon: "🏆",
        },
      ],
    }));
  };

  // ✅ Delete achievement
  const handleDelete = (index: number) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, data: newData }));
  };

  // ✅ Save to DB
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/achievementsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <Background id="achievements-dashboard">
      {/* 🔹 Header Buttons */}
      <div className="flex justify-between items-center mb-6">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              color="danger"
              variant="flat"
              onPress={() => setIsEditing(false)}
            >
              <X size={16} /> Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              disabled={saving}
              startContent={saving && <Spinner size="sm" />}
            >
              <Check size={16} /> Save
            </Button>
          </div>
        ) : (
          <Button color="secondary" onPress={() => setIsEditing(true)}>
            <Edit3 size={16} /> Edit
          </Button>
        )}
      </div>

      {/* 🔹 Grid: Edit + Preview */}
      <div
        className={`grid grid-cols-1 ${
          isEditing ? "lg:grid-cols-2" : "lg:grid-cols-1"
        } gap-6`}
      >
        {/* 🔸 Edit Form */}
        {isEditing && (
          <Card className="border border-gray-300 dark:border-gray-700 shadow-md">
            <CardBody className="space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 dark:text-gray-200">
                Heading
              </h3>

              <Input
                label="Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
              />
              <Input
                label="Sub Title"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
              />

              <h3 className="text-lg font-semibold border-b pb-2 mt-4 text-gray-700 dark:text-gray-200">
                Achievements
              </h3>

              {formData.data.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 flex flex-col gap-2 relative"
                >
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute z-10 border rounded bg-amber-50 top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) =>
                      handleChange("data", "title", e.target.value, index)
                    }
                  />
                  <Input
                    label="Count"
                    type="number"
                    value={String(item.count)}
                    onChange={(e) =>
                      handleChange(
                        "data",
                        "count",
                        Number(e.target.value),
                        index
                      )
                    }
                  />
                  <Input
                    label="Icon (emoji or icon name)"
                    value={item.icon}
                    onChange={(e) =>
                      handleChange("data", "icon", e.target.value, index)
                    }
                  />
                </div>
              ))}

              <Button
                color="success"
                variant="flat"
                startContent={<Plus size={16} />}
                onPress={handleAdd}
              >
                Add Achievement
              </Button>
            </CardBody>
          </Card>
        )}

        {/* 🔸 Preview */}
        <Card className="border border-gray-300 dark:border-gray-700 shadow-lg">
          <CardBody>
            <Background id="achievement-preview">
              <Heading
                title={formData.heading.title || "আমাদের অর্জন"}
                subTitle={formData.heading.subTitle || "Achievement Section"}
              />

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-6">
                {formData.data.map(
                  (achievement: Achievement, index: number) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="text-5xl mb-4">{achievement.icon}</div>
                      <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        {achievement.count}+
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-center">
                        {achievement.title}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </Background>
          </CardBody>
        </Card>
      </div>
    </Background>
  );
};
