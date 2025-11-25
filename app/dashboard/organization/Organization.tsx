"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";
import { useGetSection } from "../Hook/GetData";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import { Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@heroui/input";

interface Organization {
  id: string;
  name: string;
  possition: string;
  address: string;
  director: string;
  img: string;
  details: string;
}

interface OrganizationSectionData {
  heading: { title: string; subTitle: string };
  data: Organization[];
}

export const OrganizationSectionDashboard = () => {
  const { section, loading, error } = useGetSection("organizationsection");

  const [formData, setFormData] = useState<OrganizationSectionData>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [editOrgModal, setEditOrgModal] = useState<Organization | null>(null);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: section.data || [],
      });
    }
  }, [section]);

  const handleSaveSection = async (updatedData = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/organizationsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setFormData(updatedData);
      setEditOrgModal(null);
      setIsEditingHeading(false);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddOrg = () => {
    const newOrg: Organization = {
      id: Date.now().toString(),
      name: "",
      possition: "",
      address: "",
      director: "",
      img: "",
      details: "",
    };
    setEditOrgModal(newOrg);
  };

  const handleDeleteOrg = (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((org) => org.id !== id),
    };
    setFormData(updated);
    handleSaveSection(updated);
    toast.success("Deleted successfully!");
  };

  const handleModalSaveOrg = () => {
    if (!editOrgModal) return;

    if (!editOrgModal.name.trim())
      return toast.error("Organization Name is required!");
    if (!editOrgModal.possition.trim())
      return toast.error("Position is required!");
    if (!editOrgModal.address.trim())
      return toast.error("Address is required!");
    if (!editOrgModal.director.trim())
      return toast.error("Director is required!");

    const exists = formData.data.some((o) => o.id === editOrgModal.id);
    const updatedData = exists
      ? formData.data.map((o) => (o.id === editOrgModal.id ? editOrgModal : o))
      : [...formData.data, editOrgModal];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);
    handleSaveSection(updated);
  };

  const handleHeadingSave = () => {
    if (!formData.heading.title.trim())
      return toast.error("Heading title is required!");
    handleSaveSection();
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    orgId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading("Uploading image...", { id: "upload" });

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data?.secure_url) throw new Error("Upload failed!");

      setEditOrgModal((prev) =>
        prev && prev.id === orgId ? { ...prev, img: data.secure_url } : prev
      );
      toast.dismiss("upload");
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.dismiss("upload");
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    setUploading(true);
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      toast.success("Image deleted!");
    } catch (err) {
      toast.error("Delete failed!");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <p className="text-red-500 text-center py-10">
        {error || "Something went wrong!"}
      </p>
    );

  return (
    <section className="relative py-20 px-3 bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900">
      <div className="container mx-auto text-center">
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <span className="flex gap-3">
            <button onClick={handleAddOrg}>
              <IoAddCircleSharp className="text-green-500 w-7 h-7" />
            </button>
            <button onClick={() => setIsEditingHeading(true)}>
              <FaRegEdit className="text-yellow-500 w-7 h-6" />
            </button>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formData.data.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="relative shadow-lg bg-white dark:bg-gray-800">
                <div className="absolute top-3 left-3 bg-amber-100 p-2 rounded-full">
                  <Building2 className="text-amber-600" size={22} />
                </div>
                {org.img && (
                  <img
                    src={org.img}
                    alt={org.name}
                    className="w-full h-40 object-cover rounded-t-2xl cursor-pointer"
                  />
                )}
                <CardBody className="text-center py-4">
                  <h4 className="text-lg font-semibold">
                    {org.name || "Untitled"}
                  </h4>
                  <p>পজিশন: {org.possition}</p>
                  <p>ঠিকানা: {org.address}</p>
                  <p>ডিরেক্টর: {org.director}</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <button onClick={() => setEditOrgModal(org)}>
                      <FaRegEdit className="text-yellow-500 w-6 h-6" />
                    </button>
                    <button onClick={() => handleDeleteOrg(org.id)}>
                      <BsTrash3Fill className="text-rose-500 w-6 h-5" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {editOrgModal && (
          <OpenModal
            title="Edit Organization"
            isOpen={true}
            onClose={() => setEditOrgModal(null)}
            size="lg"
          >
            <div className="space-y-3">
              <Input
                label="Organization Name"
                value={editOrgModal.name}
                onChange={(e) =>
                  setEditOrgModal({ ...editOrgModal, name: e.target.value })
                }
              />
              <Input
                label="Position"
                value={editOrgModal.possition}
                onChange={(e) =>
                  setEditOrgModal({
                    ...editOrgModal,
                    possition: e.target.value,
                  })
                }
              />
              <Input
                label="Address"
                value={editOrgModal.address}
                onChange={(e) =>
                  setEditOrgModal({ ...editOrgModal, address: e.target.value })
                }
              />
              <Input
                label="Director"
                value={editOrgModal.director}
                onChange={(e) =>
                  setEditOrgModal({ ...editOrgModal, director: e.target.value })
                }
              />
              <div>
                <label className="font-semibold block mb-1">Image</label>
                {editOrgModal.img && (
                  <div className="relative mb-2">
                    <img
                      src={editOrgModal.img}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleImageDelete(editOrgModal.img);
                        setEditOrgModal({ ...editOrgModal, img: "" });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      <BsTrash3Fill className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, editOrgModal.id)}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <textarea
                rows={5}
                value={editOrgModal.details}
                onChange={(e) =>
                  setEditOrgModal({ ...editOrgModal, details: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
              <button
                onClick={handleModalSaveOrg}
                disabled={saving || uploading}
                className="w-full bg-amber-500 text-white py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </OpenModal>
        )}

        {isEditingHeading && (
          <OpenModal
            title="Edit Heading"
            isOpen={true}
            onClose={() => setIsEditingHeading(false)}
          >
            <div className="space-y-3">
              <Input
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
                label="Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heading: { ...formData.heading, subTitle: e.target.value },
                  })
                }
              />
              <button
                onClick={handleHeadingSave}
                disabled={saving || uploading}
                className="w-full bg-amber-500 text-white py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Heading"}
              </button>
            </div>
          </OpenModal>
        )}
      </div>
    </section>
  );
};
