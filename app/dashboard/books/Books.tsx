"use client";

import { useEffect, useState } from "react";
import { Spinner, Input, Textarea, Button } from "@heroui/react";
import toast from "react-hot-toast";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

export const BookSectionDashboard = () => {
  const { section, loading, error } = useGetSection("booksection");

  const [formData, setFormData] = useState<any>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleChange = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const updated = [...prev.data];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, data: updated };
    });
  };

  const notify = (msg: string, type: "success" | "error" = "success") =>
    type === "success" ? toast.success(msg) : toast.error(msg);

  const handleImageUpload = async (e: any, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading("Uploading image...", { id: "upload" });

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (data?.secure_url) {
        setFormData((prev: any) => {
          const updated = [...prev.data];
          updated[index].bookimage = data.secure_url;
          return { ...prev, data: updated };
        });
        toast.dismiss("upload");
        notify("Image uploaded successfully!");
      } else throw new Error("Upload failed");
    } catch (err: any) {
      toast.dismiss("upload");
      notify(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (index: number) => {
    const imageUrl = formData.data[index].bookimage;
    if (!imageUrl) return;

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      setFormData((prev: any) => {
        const updated = [...prev.data];
        updated[index].bookimage = "";
        return { ...prev, data: updated };
      });

      toast.dismiss("delete");
      notify("Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      notify(err.message || "Delete failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddBook = () => {
    setFormData((prev: any) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          bookname: "",
          writer: "",
          description: "",
          bookimage: "",
        },
      ],
    }));
    setEditingIndex(formData.data.length);
  };

  const handleDeleteBook = (index: number) => {
    setFormData((prev: any) => {
      const updated = prev.data.filter((_: any, i: number) => i !== index);
      return { ...prev, data: updated };
    });
    toast.success("Book removed!");
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/booksection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setEditingIndex(null);
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-600">
        📚 Book Section Dashboard
      </h2>

      {/* Heading Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Input
          label="Section Title"
          value={formData.heading.title}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              heading: { ...prev.heading, title: e.target.value },
            }))
          }
        />
        <Input
          label="Section Subtitle"
          value={formData.heading.subTitle}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              heading: { ...prev.heading, subTitle: e.target.value },
            }))
          }
        />
      </div>

      {/* Books */}
      <div className="space-y-8">
        {formData.data.map((book: any, index: number) => {
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg relative"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                {isEditing ? (
                  <Button
                    color="success"
                    size="sm"
                    variant="flat"
                    onPress={() => setEditingIndex(null)}
                  >
                    ✅ Done
                  </Button>
                ) : (
                  <Button
                    color="warning"
                    size="sm"
                    variant="flat"
                    onPress={() => setEditingIndex(index)}
                  >
                    ✏️ Edit
                  </Button>
                )}
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={() => handleDeleteBook(index)}
                >
                  🗑️ Delete
                </Button>
              </div>

              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Book Name"
                      value={book.bookname}
                      onChange={(e) =>
                        handleChange(index, "bookname", e.target.value)
                      }
                    />
                    <Input
                      label="Writer"
                      value={book.writer}
                      onChange={(e) =>
                        handleChange(index, "writer", e.target.value)
                      }
                    />
                  </div>
                  <Textarea
                    label="Description"
                    className="mt-3"
                    value={book.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-4 mt-4">
                    {book.bookimage ? (
                      <img
                        src={book.bookimage}
                        alt="Book"
                        className="w-32 h-44 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-32 h-44 bg-gray-200 rounded-md flex justify-center items-center text-sm">
                        No Image
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      {book.bookimage && (
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          onPress={() => handleImageDelete(index)}
                        >
                          Delete Image
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // ✅ Preview Mode
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={book.bookimage || "/placeholder-book.png"}
                    alt={book.bookname}
                    className="w-32 h-44 object-cover rounded-md border"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-emerald-600">
                      {book.bookname || "Untitled Book"}
                    </h3>
                    <p className="text-gray-500 mb-2">
                      ✍️ {book.writer || "Unknown Author"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {book.description || "No description provided."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-10">
        <Button color="primary" variant="flat" onPress={handleAddBook}>
          ➕ Add Book
        </Button>
        <Button
          color="success"
          onPress={handleSave}
          isLoading={saving || uploading}
        >
          💾 Save Section
        </Button>
      </div>
    </div>
  );
};
