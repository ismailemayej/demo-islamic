"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heading } from "@/components/Heading";
import Background from "@/components/background";
import {
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { toast } from "sonner";
import { Upload, Trash2, Check, X } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { FaRegEdit } from "react-icons/fa";

export const AboutSectionDashboard = () => {
  const { section, loading, error } = useGetSection<any>("aboutsection");

  const [formData, setFormData] = useState({
    heading: { title: "", subTitle: "" },
    data: { title: "", description: "", image: "" },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Load data
  useEffect(() => {
    if (section) {
      setFormData({
        heading: {
          title: section.heading?.title || "",
          subTitle: section.heading?.subTitle || "",
        },
        data: {
          title: section.data?.title || "",
          description: section.data?.description || "",
          image: section.data?.image || "",
        },
      });
    }
  }, [section]);

  const handleChange = (
    sectionType: "heading" | "data",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionType]: { ...prev[sectionType], [field]: value },
    }));
  };

  const notify = (msg: string, type: "success" | "error" = "success") => {
    type === "success" ? toast.success(msg) : toast.error(msg);
  };

  // ✅ Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData((prev) => ({
          ...prev,
          data: { ...prev.data, image: data.secure_url },
        }));
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

  // ✅ Delete Image
  const handleImageDelete = async () => {
    if (!formData.data.image) return;

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formData.data.image }),
      });

      setFormData((prev) => ({
        ...prev,
        data: { ...prev.data, image: "" },
      }));

      toast.dismiss("delete");
      notify("Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      notify(err.message || "Delete failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save to DB
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/aboutsection/update", {
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
    <Background id="about-dashboard">
      {/* 🔹 Preview Section */}
      <div>
        <Background id="about-preview">
          <div className="flex justify-between items-center mb-4">
            .
            <Heading
              title={formData.heading.title || "আমাদের সম্পর্কে"}
              subTitle={
                formData.heading.subTitle || "মাওলানা মিজানুর রহমান আল-আযহারী"
              }
            />
            <FaRegEdit
              onClick={() => setIsEditing(true)}
              className="text-yellow-500 cursor-pointer w-7 h-6"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 mt-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-1/3 flex justify-center lg:justify-start"
            >
              <div className="shadow-lg rounded-3xl overflow-hidden w-64 sm:w-72 md:w-80 border border-gray-200 dark:border-gray-700 transition-colors duration-500">
                {formData.data.image ? (
                  <img
                    src={formData.data.image}
                    alt="About"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-2/3 space-y-4"
            >
              <h3 className="text-2xl font-semibold dark:text-white bangla">
                {formData.data.title || "Who I Am"}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed bangla">
                {formData.data.description ||
                  "I am a passionate Islamic scholar dedicated to spreading the message of Islam with wisdom and understanding."}
              </p>
            </motion.div>
          </div>
        </Background>
      </div>

      {/* 🔹 Edit Modal */}
      <Modal
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                Edit About Section
              </ModalHeader>
              <ModalBody className="max-h-[70vh] overflow-y-auto">
                <div className="space-y-3">
                  <Input
                    size="md"
                    label="Heading Title"
                    value={formData.heading.title}
                    onChange={(e) =>
                      handleChange("heading", "title", e.target.value)
                    }
                  />
                  <Input
                    size="md"
                    label="Sub Title"
                    value={formData.heading.subTitle}
                    onChange={(e) =>
                      handleChange("heading", "subTitle", e.target.value)
                    }
                  />
                  <Input
                    size="md"
                    label="About Title"
                    value={formData.data.title}
                    onChange={(e) =>
                      handleChange("data", "title", e.target.value)
                    }
                  />
                  <textarea
                    value={formData.data.description}
                    onChange={(e) =>
                      handleChange("data", "description", e.target.value)
                    }
                    placeholder="Description"
                    className="w-full p-3 rounded-lg border text-gray-800 dark:bg-gray-800 dark:text-white"
                    rows={6}
                  />

                  <div className="mt-3">
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      Image Upload
                    </label>
                    {formData.data.image ? (
                      <div className="relative mt-2 w-48">
                        <Image
                          src={formData.data.image}
                          alt="about"
                          width={200}
                          height={200}
                          className="rounded-xl border"
                        />
                        <button
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={handleImageDelete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <Upload className="w-5 h-5 mb-1 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {uploading ? "Uploading..." : "Upload Image"}
                        </span>
                        <Input
                          size="md"
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Background>
  );
};
