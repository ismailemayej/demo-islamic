"use client";

import { useEffect, useState } from "react";
import { Spinner, Input, Textarea, Button } from "@heroui/react";
import toast from "react-hot-toast";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { OpenModal } from "@/components/Modal";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { Heading } from "@/components/Heading";
import JoditEditor from "jodit-react";

interface Book {
  id: string;
  bookname: string;
  writer: string;
  description: string;
  bookimage?: string;
}

interface BookSectionData {
  heading: { title: string; subTitle: string };
  data: Book[];
}

export const BookSectionDashboard = () => {
  const { section, loading, error } = useGetSection("booksection");

  const [formData, setFormData] = useState<BookSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [headingModalOpen, setHeadingModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleSaveSection = async (updatedData: BookSectionData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/booksection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setSelectedBook(null);
      setModalOpen(false);
      setHeadingModalOpen(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Book, value: string) => {
    if (!selectedBook) return;
    setSelectedBook({ ...selectedBook, [field]: value });
  };

  const handleModalSave = () => {
    if (!selectedBook) return;
    const exists = formData.data.some((b) => b.id === selectedBook.id);
    const updatedData = exists
      ? formData.data.map((b) => (b.id === selectedBook.id ? selectedBook : b))
      : [...formData.data, selectedBook];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSaveSection(updated);
  };

  const handleDeleteBook = async (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((b) => b.id !== id),
    };
    setFormData(updated);
    handleSaveSection(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBook) return;
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
        setSelectedBook({ ...selectedBook, bookimage: data.secure_url });
        toast.dismiss("upload");
        toast.success("Image uploaded successfully!");
      } else throw new Error("Upload failed");
    } catch (err: any) {
      toast.dismiss("upload");
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = () => {
    if (!selectedBook?.bookimage) return;
    setSelectedBook({ ...selectedBook, bookimage: "" });
    toast.success("Image deleted!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        {" "}
        <Spinner size="lg" />{" "}
      </div>
    );

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Heading Preview */}
      <div className="flex justify-between items-center mx-auto gap-7 mb-6">
        <Heading
          title={formData.heading.title}
          subTitle={formData.heading.subTitle}
        />
        <div className="flex items-end gap-3">
          <IoAddCircleSharp
            className="text-green-500 cursor-pointer w-7 h-7"
            onClick={() => {
              const newBook: Book = {
                id: Date.now().toString(),
                bookname: "",
                writer: "",
                description: "",
                bookimage: "",
              };
              setSelectedBook(newBook);
              setModalOpen(true);
            }}
          />
          <FaRegEdit
            className="text-yellow-500 cursor-pointer w-7 h-6"
            onClick={() => setHeadingModalOpen(true)}
          />
        </div>
      </div>
      {/* Heading Edit Modal */}
      {headingModalOpen && (
        <OpenModal
          isOpen={headingModalOpen}
          onClose={() => setHeadingModalOpen(false)}
          title="Edit Heading"
        >
          <div className="flex flex-col gap-3">
            <Input
              label="Section Title"
              value={formData.heading.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heading: { ...formData.heading, title: e.target.value },
                })
              }
            />
            <Input
              label="Section Subtitle"
              value={formData.heading.subTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heading: { ...formData.heading, subTitle: e.target.value },
                })
              }
            />
            <Button
              color="success"
              onPress={() => handleSaveSection()}
              isLoading={saving}
            >
              💾 Save Heading
            </Button>
          </div>
        </OpenModal>
      )}
      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {formData.data?.reverse()?.map((book) => (
          <div
            key={book.id}
            className="p-4 border rounded-lg relative shadow-xl bg-white dark:bg-gray-800"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  setSelectedBook(book);
                  setModalOpen(true);
                }}
              >
                <FaRegEdit className="text-yellow-500 cursor-pointer w-7 h-6" />
              </button>
              <button onClick={() => handleDeleteBook(book.id)}>
                <BsTrash3Fill className="text-rose-500 cursor-pointer w-6 h-5" />
              </button>
            </div>

            <img
              src={book.bookimage || "/placeholder-book.png"}
              alt={book.bookname}
              className="lg:w-1/2 w-full h-62 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold text-emerald-600">
              {book.bookname}
            </h3>
            <p className="text-gray-500">✍️ {book.writer}</p>
            <p
              className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4"
              dangerouslySetInnerHTML={{
                __html:
                  book.description ||
                  "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
              }}
            ></p>
          </div>
        ))}
      </div>
      {/* Modal for Add/Edit Book */}
      {modalOpen && selectedBook && (
        <OpenModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit Book"
        >
          <div className="flex flex-col space-y-3 max-h-[70vh] overflow-y-auto">
            <Input
              size="md"
              label="Book Name"
              value={selectedBook.bookname}
              onChange={(e) => handleChange("bookname", e.target.value)}
            />
            <Input
              size="md"
              label="Writer"
              value={selectedBook.writer}
              onChange={(e) => handleChange("writer", e.target.value)}
            />
            <JoditEditor
              value={selectedBook.description}
              onChange={(content: string) =>
                handleChange("description", content)
              }
              config={{
                readonly: false,
                toolbarSticky: false,
                showXPathInStatusbar: false,
                height: 200,
                askBeforePasteHTML: false,
              }}
            />

            {selectedBook.bookimage && (
              <>
                <img
                  src={selectedBook.bookimage}
                  alt={selectedBook.bookname}
                  className="w-32 h-44 object-cover rounded-md"
                />
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleImageDelete}
                >
                  Delete Image
                </Button>
              </>
            )}
            <Input
              size="md"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                color="secondary"
                variant="flat"
                onPress={() => setModalOpen(false)}
              >
                Close
              </Button>
              <Button
                color="success"
                onPress={handleModalSave}
                isLoading={saving || uploading}
              >
                💾 Save
              </Button>
            </div>
          </div>
        </OpenModal>
      )}
    </div>
  );
};
