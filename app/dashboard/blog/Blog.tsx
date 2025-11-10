"use client";

import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { useGetSection } from "../Hook/GetData";
import { Spinner } from "@heroui/spinner";

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

  // ✅ Handle input changes
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
          date: new Date().toISOString().split("T")[0], // auto date
        },
      ],
    }));
  };

  // ✅ Delete blog/article
  const handleDelete = (index: number) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, data: newData }));
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
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    }
  };

  // ✅ Loading and Error States
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  // ✅ Main UI
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

        {/* Buttons */}
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

        {/* Articles Grid */}
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
                <input
                  type="text"
                  value={article.blogtitle}
                  onChange={(e) =>
                    handleChange("data", "blogtitle", e.target.value, index)
                  }
                  className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 bg-transparent w-full mb-2 border-b border-gray-300 focus:outline-none"
                />
                <textarea
                  value={article.blogdescription}
                  onChange={(e) =>
                    handleChange(
                      "data",
                      "blogdescription",
                      e.target.value,
                      index
                    )
                  }
                  className="text-gray-700 dark:text-gray-300 bg-transparent w-full mb-2 border-b border-gray-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={article.blogwriter}
                  onChange={(e) =>
                    handleChange("data", "blogwriter", e.target.value, index)
                  }
                  className="text-sm text-gray-500 dark:text-gray-400 bg-transparent w-full border-b border-gray-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {article.date}
                </p>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Background>
  );
};
