"use client";

import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";

interface Article {
  id: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

interface ArticleSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: Article[];
}

export const ArticlesSectionDashboard: React.FC = () => {
  const { section, loading, error } =
    useGetSection<ArticleSection>("blogsection");

  const [formData, setFormData] = useState<ArticleSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

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

  // ✅ Deep clone helper
  const prevData = (data: Article[]) => JSON.parse(JSON.stringify(data));

  // ✅ Handle input change
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

  // ✅ Add new blog/article
  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          blogtitle: "New Blog Title",
          blogdescription: "Write your blog description...",
          blogwriter: "Author name",
          date: new Date().toISOString().split("T")[0],
        },
      ],
    }));
  };

  // ✅ Delete blog
  const handleDelete = (index: number) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, data: newData }));
  };

  // ✅ Edit blog
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setIsEditing(true);
  };

  // ✅ Save to Database
  const handleSave = async () => {
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/blogsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setIsEditing(false);
      setEditIndex(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
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
    <Background id="blog">
      <div className="container mx-auto">
        <Heading
          title={formData.heading.title || " ব্লগ এবং নিবন্ধসমূহ "}
          subTitle={
            formData.heading.subTitle ||
            " সাম্প্রতিক ইসলামিক শিক্ষণ ও দাওয়াতি প্রবন্ধসমূহ "
          }
        />

        {/* Top Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            ➕ Add
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            💾 Save
          </button>
        </div>

        {/* Normal Article View */}
        {!isEditing && (
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {formData.data.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    {article.blogtitle}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {article.blogdescription.slice(0, 100)}...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ✍️ {article.blogwriter}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {article.date}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ✏️ Full Screen Editor */}
        {isEditing && editIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">
                ✏️ Edit Article
              </h2>
              <input
                type="text"
                value={formData.data[editIndex].blogtitle}
                onChange={(e) =>
                  handleChange("data", "blogtitle", e.target.value, editIndex)
                }
                className="w-full text-2xl font-bold mb-3 border-b border-gray-300 focus:outline-none bg-transparent"
              />
              <textarea
                value={formData.data[editIndex].blogdescription}
                onChange={(e) =>
                  handleChange(
                    "data",
                    "blogdescription",
                    e.target.value,
                    editIndex
                  )
                }
                className="w-full h-64 text-gray-800 dark:text-gray-200 border border-gray-300 rounded-lg p-3 focus:outline-none mb-3 bg-transparent"
                placeholder="Write full blog content here..."
              />
              <input
                type="text"
                value={formData.data[editIndex].blogwriter}
                onChange={(e) =>
                  handleChange("data", "blogwriter", e.target.value, editIndex)
                }
                className="w-full text-gray-600 border-b border-gray-300 focus:outline-none bg-transparent mb-4"
                placeholder="Author name"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditIndex(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Background>
  );
};
