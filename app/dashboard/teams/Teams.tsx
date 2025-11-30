"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Heading } from "@/components/Heading";
import Background from "@/components/background";
import { useGetSection } from "../Hook/GetData";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "@heroui/button";
import { OpenModal } from "@/components/Modal";
import { Input } from "@heroui/input";
import { BsTrash3Fill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  imageurl: string;
  number?: string;
}

interface TeamSection {
  heading: { title: string; subTitle: string };
  data: TeamMember[];
}

export const TeamSectionDashboard = () => {
  const { section, loading, error } = useGetSection("teamsection");

  const [formData, setFormData] = useState<TeamSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [headingEditOpen, setHeadingEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (section) setFormData(section);
  }, [section]);

  const handleHeadingChange = (field: "title" | "subTitle", value: string) => {
    setFormData((prev) => ({
      ...prev,
      heading: { ...prev.heading, [field]: value },
    }));
  };

  const handleMemberChange = (field: keyof TeamMember, value: string) => {
    if (!selectedMember) return;
    setSelectedMember({ ...selectedMember, [field]: value });
  };

  // 🔹 Add New Member and Open Modal
  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      position: "",
      imageurl: "",
      number: "",
    };
    setSelectedMember(newMember);
    setModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!selectedMember) return;

    // 🔹 Validation
    if (!selectedMember.name.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (!selectedMember.position.trim()) {
      toast.error("Position is required!");
      return;
    }

    const exists = formData.data.some((m) => m.id === selectedMember.id);

    const updatedData = exists
      ? formData.data.map((m) =>
          m.id === selectedMember.id ? selectedMember : m
        )
      : [...formData.data, selectedMember];

    const updated = { ...formData, data: updatedData };
    setFormData(updated);

    setSaving(true);
    toast.loading("Saving...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/teamsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const json = await res.json();
      if (!json.success) throw new Error("Save failed");

      toast.dismiss("save");
      toast.success("Saved successfully!");
      setModalOpen(false);
      setSelectedMember(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((m) => m.id !== id),
    };

    setFormData(updated);

    setSaving(true);
    toast.loading("Deleting...", { id: "delete" });

    try {
      const res = await fetch("/api/all-data/teamsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const json = await res.json();
      if (!json.success) throw new Error("Delete failed");

      toast.dismiss("delete");
      toast.success("Deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    if (!selectedMember) return;
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
        setSelectedMember({ ...selectedMember, imageurl: data.secure_url });
        toast.dismiss("upload");
        toast.success("Image uploaded!");
      } else throw new Error("Upload failed");
    } catch (err: any) {
      toast.dismiss("upload");
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = () => {
    if (!selectedMember?.imageurl) return;
    setSelectedMember({ ...selectedMember, imageurl: "" });
    toast.success("Image deleted!");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <Background id="team">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mx-auto gap-7 mb-6">
          <div className="flex-1 text-center">
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
            />
          </div>
          <div className="flex align-bottom gap-3">
            <IoAddCircleSharp
              className="text-green-500 cursor-pointer w-7 h-7"
              onClick={handleAddMember}
            />
            <FaRegEdit
              className="text-yellow-500 cursor-pointer w-7 h-6"
              onClick={() => setHeadingEditOpen(true)}
            />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {formData.data?.reverse()?.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-between relative"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setModalOpen(true);
                  }}
                >
                  <FaRegEdit className="text-yellow-500 cursor-pointer w-6 h-6" />
                </button>

                <button onClick={() => handleDeleteMember(member.id)}>
                  <BsTrash3Fill className="text-rose-500 cursor-pointer w-6 h-5" />
                </button>
              </div>

              {member.imageurl && (
                <img
                  src={member.imageurl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                />
              )}

              <h3 className="text-lg font-semibold dark:text-white">
                {member.name}
              </h3>
              <p className="text-amber-600">{member.position}</p>

              {member.number && (
                <a
                  href={`https://wa.me/${member.number}`}
                  target="_blank"
                  className="text-sm text-sky-500 mt-1"
                >
                  WhatsApp
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🔹 Member Edit Modal */}
        {modalOpen && selectedMember && (
          <OpenModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Edit Member"
          >
            <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
              {selectedMember.imageurl && (
                <img
                  src={selectedMember.imageurl}
                  className="w-24 h-24 rounded-full mb-2 object-cover mx-auto"
                />
              )}
              <Input
                size="md"
                label="Name"
                value={selectedMember.name}
                onChange={(e) => handleMemberChange("name", e.target.value)}
              />

              <Input
                size="md"
                label="Position"
                value={selectedMember.position}
                onChange={(e) => handleMemberChange("position", e.target.value)}
              />

              <Input
                size="md"
                label="Phone / WhatsApp"
                value={selectedMember.number}
                onChange={(e) => handleMemberChange("number", e.target.value)}
              />

              <Input
                size="md"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {selectedMember.imageurl && (
                <Button onClick={handleImageDelete}>Delete Image</Button>
              )}

              <Button onClick={handleModalSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </OpenModal>
        )}

        {/* 🔹 Heading Edit Modal */}
        {headingEditOpen && (
          <OpenModal
            isOpen={headingEditOpen}
            onClose={() => setHeadingEditOpen(false)}
            title="Edit Heading"
          >
            <div className="flex flex-col gap-3">
              <Input
                size="md"
                label="Title"
                value={formData.heading.title}
                onChange={(e) => handleHeadingChange("title", e.target.value)}
              />

              <Input
                size="md"
                label="Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleHeadingChange("subTitle", e.target.value)
                }
              />

              <Button
                onClick={async () => {
                  setSaving(true);
                  toast.loading("Saving...", { id: "heading" });

                  try {
                    const updated = { ...formData };
                    const res = await fetch(
                      "/api/all-data/teamsection/update",
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updated),
                      }
                    );

                    const json = await res.json();
                    if (!json.success) throw new Error("Failed to update");

                    toast.dismiss("heading");
                    toast.success("Heading Updated!");
                    setHeadingEditOpen(false);
                  } catch (err: any) {
                    toast.dismiss("heading");
                    toast.error(err.message);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </OpenModal>
        )}
      </div>
    </Background>
  );
};
