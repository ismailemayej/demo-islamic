"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Heading } from "@/components/Heading";
import { useGetSection } from "../Hook/GetData";
import Background from "@/components/background";
import { OpenModal } from "@/components/Modal";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { PlusCircle, Save } from "lucide-react";
import JoditEditor from "jodit-react";
import RichSimpleEditor from "@/components/SimpleEditor";
import { Calendar, User } from "lucide-react"; // Preview Modal-এর জন্য আইকন যোগ করা হলো

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
  const editor = useRef(null);

  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🟢 Edit/Add Modal-এর জন্য স্টেট
  const [modalOpen, setModalOpen] = useState(false);

  // 🟢 Preview Modal-এর জন্য নতুন স্টেট
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Load Data
  useEffect(() => {
    if (section) {
      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: section.data || [],
      });
    }
  }, [section]);

  // Save to DB
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
      toast.success("Updated Successfully!");

      setActiveArticle(null);
      setEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Article Change
  const handleArticleChange = (field: keyof Article, value: string) => {
    if (!activeArticle) return;
    setActiveArticle({ ...activeArticle, [field]: value });
  };

  // Add New Blog (Auto Date Set)
  const handleAddNew = () => {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    setActiveArticle({
      id: crypto.randomUUID(),
      blogtitle: "",
      blogdescription: "",
      blogwriter: "",
      date: today,
    });

    setModalOpen(true); // Edit Modal খোলে
  };

  // Save modal data (Add/Edit)
  const handleModalSave = () => {
    if (!activeArticle) return;

    // Basic validation
    if (
      !activeArticle.blogtitle ||
      !activeArticle.blogwriter ||
      !activeArticle.blogdescription
    ) {
      toast.error("Title, Writer, and Description are required.");
      return;
    }

    const exists = formData.data.some((a) => a.id === activeArticle.id);
    const updatedData = exists
      ? formData.data.map((a) =>
          a.id === activeArticle.id ? activeArticle : a
        )
      : [...formData.data, activeArticle];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSave(updated);

    setActiveArticle(null);
    setModalOpen(false);
  };

  // Delete
  const handleDelete = (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((a) => a.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("Deleted successfully");
  };

  // Close Edit/Add Modal Handler
  const handleCloseEditModal = () => {
    setModalOpen(false);
    setActiveArticle(null);
  };

  // Close Preview Modal Handler
  const handleClosePreviewModal = () => {
    setPreviewModalOpen(false);
    setActiveArticle(null);
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
        {/* Heading + Edit + Add Blog Button */}
        <div className="flex justify-center items-center gap-6 mb-10 pt-10">
          <div className="flex-1 text-center">
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
            />
          </div>

          {/* Edit Heading */}
          <button
            onClick={() => setEditingHeading(true)}
            className="hover:scale-110 transition-transform p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/50 shadow-md"
            title="Edit Section Heading"
          >
            <FaRegEdit className="text-yellow-600 dark:text-yellow-400 w-6 h-5" />
          </button>

          {/* Add New Blog */}
          <button
            onClick={handleAddNew}
            className="hover:scale-110 transition-transform p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 shadow-md"
            title="Add New Article"
          >
            <PlusCircle className="text-emerald-600 dark:text-emerald-400 w-7 h-7" />
          </button>
        </div>

        {/* Edit Heading Modal (Unchanged) */}
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
                className="dark:bg-gray-700 dark:text-white"
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
                className="dark:bg-gray-700 dark:text-white"
              />

              <div className="flex justify-end gap-3 mt-5">
                <Button
                  onClick={() => setEditingHeading(false)}
                  color="secondary"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => handleSave()}
                  disabled={saving}
                  color="success"
                >
                  {saving ? "Saving..." : "Save Heading"}
                </Button>
              </div>
            </div>
          </OpenModal>
        )}

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {formData?.data
            ?.slice()
            ?.reverse()
            ?.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 relative ring-1 ring-gray-100 dark:ring-gray-700"
              >
                {/* Title: Clickable to open Preview Modal */}
                <h3
                  className="text-2xl font-bold mb-3 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline transition-colors leading-snug"
                  onClick={() => {
                    setActiveArticle(article);
                    setPreviewModalOpen(true);
                  }}
                >
                  {article.blogtitle}
                </h3>

                {/* Description Snippet */}
                <p
                  className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      article.blogdescription ||
                      "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
                  }}
                ></p>

                {/* Footer Info */}
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    ✍️ {article.blogwriter}
                  </span>
                  |
                  <span className="flex items-center gap-1">
                    📅 {article.date}
                  </span>
                </p>

                {/* Action Buttons (Absolute Positioned) */}
                <div className="absolute top-4 right-4 flex gap-3">
                  {/* Edit Button */}
                  <button
                    className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-transform hover:scale-110 shadow-md"
                    onClick={() => {
                      setActiveArticle(article);
                      setModalOpen(true);
                    }}
                    title="Edit Article"
                  >
                    <FaRegEdit className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-700 transition-transform hover:scale-110 shadow-md"
                    onClick={() => handleDelete(article.id)}
                    title="Delete Article"
                  >
                    <BsTrash3Fill className="text-rose-600 dark:text-rose-400 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 👁️ Preview Modal (Read-Only) */}
        {previewModalOpen && activeArticle && (
          <OpenModal
            title={activeArticle.blogtitle}
            isOpen={previewModalOpen}
            onClose={handleClosePreviewModal}
            size="xl"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {/* Meta Info */}
              <div className="flex justify-between items-center mb-6 pb-2 border-b dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                  <User size={18} className="text-yellow-500" />
                  Writer: {activeArticle.blogwriter}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Date: {activeArticle.date}
                </p>
              </div>

              {/* Full Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p
                  className="text-gray-800 dark:text-gray-200 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html:
                      activeArticle.blogdescription ||
                      "No description provided.",
                  }}
                ></p>
              </div>
            </div>
            {/* Modal Footer/Close Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleClosePreviewModal} color="primary">
                Close Preview
              </Button>
            </div>
          </OpenModal>
        )}
        {/* ------------------------------------------------------------- */}

        {/* ✏️ Add/Edit Article Modal */}
        {modalOpen && activeArticle && (
          <OpenModal
            title={`${activeArticle.blogtitle ? "Edit Article: " + activeArticle.blogtitle : "Add New Article"}`}
            isOpen={modalOpen}
            onClose={handleCloseEditModal}
            size="xl"
          >
            <div className="max-h-[80vh] overflow-y-auto space-y-6 p-4">
              <Input
                size="md"
                label="Blog Title"
                value={activeArticle.blogtitle}
                onChange={(e) =>
                  handleArticleChange("blogtitle", e.target.value)
                }
                className="dark:bg-gray-700 dark:text-white"
                placeholder="Enter the title of the article"
              />

              <Input
                size="md"
                label="Writer Name"
                value={activeArticle.blogwriter}
                onChange={(e) =>
                  handleArticleChange("blogwriter", e.target.value)
                }
                className="dark:bg-gray-700 dark:text-white"
                placeholder="Name of the writer"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Description
                </label>
                {/* Rich Text Editor */}
                <RichSimpleEditor
                  initialValue={activeArticle.blogdescription}
                  onChange={(value) =>
                    handleArticleChange("blogdescription", value)
                  }
                  className="bangla w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg dark:bg-gray-700 dark:text-white shadow-inner"
                />
              </div>

              <Input
                size="md"
                label="Date"
                type="date"
                value={activeArticle.date}
                onChange={(e) => handleArticleChange("date", e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={handleCloseEditModal} color="secondary">
                  Cancel
                </Button>

                <Button
                  onClick={handleModalSave}
                  disabled={saving}
                  color="success"
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
