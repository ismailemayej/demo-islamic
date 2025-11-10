"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { Heading } from "@/components/Heading";
import Background from "@/components/background";
import { useGetSection } from "../Hook/GetData";
import { Button } from "@heroui/button";

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
  const { section, loading, error } = useGetSection("blogsection");

  const [formData, setFormData] = useState<ArticleSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isHeadingEditing, setIsHeadingEditing] = useState(false);
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

  // ✅ Handle Input Change
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

  // ✅ Add new Article
  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          blogtitle: "New Article Title",
          blogdescription: "Write your article content here...",
          blogwriter: "Anonymous",
          date: new Date().toISOString().split("T")[0],
        },
      ],
    }));
  };

  // ✅ Delete Article
  const handleDelete = (index: number) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, data: newData }));
  };

  // ✅ Save to DB
  const handleSave = async () => {
    setSaving(true);
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
      setIsHeadingEditing(false);
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
    <Background id="blog">
      <div className="container mx-auto">
        {/* ✅ Heading Section */}
        <div className="flex items-center justify-between">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <Button onClick={() => setIsHeadingEditing(!isHeadingEditing)}>
            {isHeadingEditing ? "Cancel" : "Edit Heading"}
          </Button>
        </div>

        {isHeadingEditing && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md mt-4 space-y-4">
            <input
              type="text"
              value={formData.heading.title}
              onChange={(e) => handleChange("heading", "title", e.target.value)}
              placeholder="Heading Title"
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white text-lg"
            />
            <textarea
              value={formData.heading.subTitle}
              onChange={(e) =>
                handleChange("heading", "subTitle", e.target.value)
              }
              placeholder="Heading Subtitle"
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white text-base"
              rows={5}
            />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Heading"}
            </Button>
          </div>
        )}

        {/* ✅ Article Cards */}
        <div className="flex justify-between mt-12 mb-4">
          <Button onClick={handleAdd}>Add New Article</Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel Edit" : "Edit Articles"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formData.data.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {isEditing ? (
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={article.blogtitle}
                    onChange={(e) =>
                      handleChange("data", "blogtitle", e.target.value, index)
                    }
                    className="w-full p-3 text-lg rounded-md border dark:bg-gray-900 dark:text-white"
                    placeholder="Article Title"
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
                    rows={12} // ✅ বড় textarea
                    className="w-full p-4 text-base rounded-md border dark:bg-gray-900 dark:text-white leading-relaxed"
                    placeholder="Write the full article here..."
                  />
                  <input
                    type="text"
                    value={article.blogwriter}
                    onChange={(e) =>
                      handleChange("data", "blogwriter", e.target.value, index)
                    }
                    className="w-full p-3 rounded-md border dark:bg-gray-900 dark:text-white"
                    placeholder="Writer name"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {article.date}
                  </p>
                  <Button
                    // variant="destructive"
                    onClick={() => handleDelete(index)}
                    className="mt-2"
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    {article.blogtitle}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed text-justify">
                    {article.blogdescription}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ✍️ {article.blogwriter} | 📅 {article.date}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Background>
  );
};
