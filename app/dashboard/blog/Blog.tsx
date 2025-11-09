"use client";

import { useState } from "react";
import Background from "@/components/background";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGetSection } from "../Hook/GetData";

interface Article {
  _id?: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

export const ArticlesSectionDashboard: React.FC = () => {
  const { section, loading } = useGetSection("blogsection");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [heading, setHeading] = useState({
    title: section?.heading?.title || "ব্লগ এবং নিবন্ধসমূহ",
    subTitle:
      section?.heading?.subTitle ||
      "সাম্প্রতিক ইসলামিক শিক্ষণ ও দাওয়াতি প্রবন্ধসমূহ",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ARTICLES: Article[] = section?.data || [];

  // Heading Save
  const saveHeading = async () => {
    try {
      const res = await fetch(`/api/update-heading/blogsection`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heading),
      });
      if (res.ok) {
        toast.success("Heading Updated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update heading!");
    }
  };

  // Article Save
  const saveArticle = async () => {
    if (!editingArticle) return;
    try {
      const res = await fetch(
        `/api/update-data/blogsection/${editingArticle._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingArticle),
        }
      );
      if (res.ok) {
        toast.success("Article Updated!");
        setEditingArticle(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update article!");
    }
  };

  // Add new article
  const handleAddArticle = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const newArticle: Article = {
      _id: Date.now().toString(),
      blogtitle: "",
      blogdescription: "",
      blogwriter: "",
      date: formattedDate,
    };

    setEditingArticle(newArticle); // শুধুমাত্র নতুন আর্টিকেল এডিট মডাল খুলবে
  };

  return (
    <Background id="blog">
      <div className="container mx-auto">
        {/* Editable Heading */}
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <input
            type="text"
            value={heading.title}
            onChange={(e) => setHeading({ ...heading, title: e.target.value })}
            className="w-full p-3 rounded-xl border mb-2 dark:bg-gray-700"
          />
          <input
            type="text"
            value={heading.subTitle}
            onChange={(e) =>
              setHeading({ ...heading, subTitle: e.target.value })
            }
            className="w-full p-3 rounded-xl border dark:bg-gray-700"
          />
          <button
            onClick={saveHeading}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-xl transition"
          >
            Save Heading
          </button>
        </div>

        {/* Add New Article Button */}
        <div className="mb-6">
          <button
            onClick={handleAddArticle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
          >
            Add New Article
          </button>
        </div>

        {/* Blog Preview Section */}
        <div className="grid gap-4 md:grid-cols-4">
          {ARTICLES.length > 0 &&
            ARTICLES.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    {article.blogtitle}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {article.blogdescription}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    ✍️ {article.blogwriter}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-400">{article.date}</p>
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Edit Article Modal */}
        {editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4">
                {editingArticle._id ? "Edit Article" : "New Article"}
              </h3>
              <input
                type="text"
                placeholder="Title"
                value={editingArticle.blogtitle}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    blogtitle: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border mb-2 dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Writer"
                value={editingArticle.blogwriter}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    blogwriter: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border mb-2 dark:bg-gray-700"
              />
              <textarea
                placeholder="Description"
                value={editingArticle.blogdescription}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    blogdescription: e.target.value,
                  })
                }
                rows={4}
                className="w-full p-3 rounded-xl border dark:bg-gray-700 mb-2"
              ></textarea>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingArticle(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={saveArticle}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Background>
  );
};
