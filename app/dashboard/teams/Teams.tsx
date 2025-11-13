"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Heading } from "@/components/Heading";
import Background from "@/components/background";
import { useGetSection } from "../Hook/GetData";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Button } from "@heroui/button";
import { OpenModal } from "@/components/Modal";

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

  const handleModalSave = async () => {
    if (!selectedMember) return;
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
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
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
      if (!json.success) throw new Error(json.error || "Delete failed");
      toast.dismiss("delete");
      toast.success("✅ Deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
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
    if (!selectedMember?.imageurl) return;
    setSelectedMember({ ...selectedMember, imageurl: "" });
    toast.success("Image deleted!");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <Background id="team">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <Button
            onClick={() => {
              const newMember: TeamMember = {
                id: Date.now().toString(),
                name: "",
                position: "",
                imageurl: "",
                number: "",
              };
              setSelectedMember(newMember);
              setModalOpen(true);
            }}
          >
            Add Member
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {formData.data.map((member) => (
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
                  className="text-amber-500 hover:text-amber-700"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>

              {member.imageurl && (
                <img
                  src={member.imageurl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{member.name}</h3>
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

        {modalOpen && selectedMember && (
          <OpenModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Edit Member"
          >
            <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
              <input
                type="text"
                value={selectedMember.name}
                onChange={(e) => handleMemberChange("name", e.target.value)}
                placeholder="Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                value={selectedMember.position}
                onChange={(e) => handleMemberChange("position", e.target.value)}
                placeholder="Position"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                value={selectedMember.number}
                onChange={(e) => handleMemberChange("number", e.target.value)}
                placeholder="Phone / WhatsApp"
                className="w-full p-2 border rounded-md"
              />

              {selectedMember.imageurl && (
                <img
                  src={selectedMember.imageurl}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
              )}
              <input
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
      </div>
    </Background>
  );
};
