"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Heading } from "@/components/Heading";
import { useGetSection } from "../Hook/GetData";
import Background from "@/components/background";
import { OpenModal } from "@/components/Modal";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";

interface Article {
  id: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

interface HeadingType {
  title: string;
  subTitle: string;
}

interface FormDataType {
  heading: HeadingType;
  data: Article[];
}

export const ArticlesSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("blogsection");
  const [formData, setFormData] = useState<FormDataType>({
    heading: { title: "", subTitle: "" },
    data: [],
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Load API data
  useEffect(() => {
    if (section) {
      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: section.data || [],
      });
    }
  }, [section]);

  // ✅ Save to DB
  const handleSave = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/blogsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Updated Successfully!");
      setSelectedArticle(null);
      setEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Article Change
  const handleArticleChange = (field: keyof Article, value: string) => {
    if (!selectedArticle) return;
    setSelectedArticle({ ...selectedArticle, [field]: value });
  };

  const handleModalSave = () => {
    if (!selectedArticle) return;
    const exists = formData.data.some((a) => a.id === selectedArticle.id);
    const updatedData = exists
      ? formData.data.map((a) =>
          a.id === selectedArticle.id ? selectedArticle : a
        )
      : [...formData.data, selectedArticle];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);
    setSelectedArticle(null);
    setModalOpen(false);
  };

  // ✅ Handle Delete
  const handleDelete = (id: string) => {
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
    <Background id="blog">
      <div className="container mx-auto">
        {/* ---------- Heading ---------- */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <button
            onClick={() => setEditingHeading(true)}
            className="hover:scale-110 transition-transform"
          >
            <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6 justify-end" />
          </button>
        </div>

        {/* ---------- Edit Heading Modal ---------- */}
        {editingHeading && (
          <OpenModal
            title="Edit Section Heading"
            isOpen={editingHeading}
            onClose={() => setEditingHeading(false)}
            size="md"
          >
            <div className="space-y-4">
              <Input
                size="md"
                label="Title"
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
                value={formData.heading.subTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heading: { ...formData.heading, subTitle: e.target.value },
                  })
                }
              />
              <div className="flex justify-end gap-3 mt-3">
                <Button
                  onClick={() => setEditingHeading(false)}
                  className="bg-gray-400 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="bg-emerald-600 text-white"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </OpenModal>
        )}

        {/* ---------- Articles Grid ---------- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {formData.data.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 relative"
            >
              <h3 className="text-2xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">
                {article.blogtitle}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                {article.blogdescription}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✍️ {article.blogwriter} | 📅 {article.date}
              </p>

              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  className="hover:scale-110 transition-transform"
                  onClick={() => {
                    setSelectedArticle(article);
                    setModalOpen(true);
                  }}
                >
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-5" />
                </button>
                <button
                  className="hover:scale-110 transition-transform"
                  onClick={() => handleDelete(article.id)}
                >
                  <BsTrash3Fill className="text-rose-500 cursor-pointer w-6 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------- Edit / Add Modal ---------- */}
        {modalOpen && selectedArticle && (
          <OpenModal
            title={`Edit: ${selectedArticle.blogtitle}`}
            isOpen={modalOpen}
            onClose={() => setSelectedArticle(null)}
            size="xl"
          >
            <div className="max-h-[80vh] overflow-y-auto space-y-4 p-4">
              <Input
                size="md"
                label="Title"
                value={selectedArticle.blogtitle}
                onChange={(e) =>
                  handleArticleChange("blogtitle", e.target.value)
                }
              />
              <Input
                size="md"
                label="Writer"
                value={selectedArticle.blogwriter}
                onChange={(e) =>
                  handleArticleChange("blogwriter", e.target.value)
                }
              />
              <textarea
                value={selectedArticle.blogdescription}
                onChange={(e) =>
                  handleArticleChange("blogdescription", e.target.value)
                }
                rows={12}
                className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <Input
                size="md"
                label="Date"
                type="date"
                value={selectedArticle.date}
                onChange={(e) => handleArticleChange("date", e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-3">
                <Button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-gray-400 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleModalSave}
                  disabled={saving}
                  className="bg-emerald-600 text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </OpenModal>
        )}
      </div>
    </Background>
  );
};
