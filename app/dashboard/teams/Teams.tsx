"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Heading } from "@/components/Heading";
import Background from "@/components/background";
import { useGetSection } from "../Hook/GetData";
import { Button } from "@heroui/button";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  imageurl: string;
  number?: string;
}

interface TeamSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: TeamMember[];
}

export const TeamSectionDashboard = () => {
  const { section, loading, error } = useGetSection("teamsection");

  const [formData, setFormData] = useState<TeamSection>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (section) setFormData(section);
  }, [section]);

  // Heading change
  const handleHeadingChange = (field: "title" | "subTitle", value: string) => {
    setFormData((prev) => ({
      ...prev,
      heading: { ...prev.heading, [field]: value },
    }));
  };

  // Team member change
  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newData = [...formData.data];
    newData[index] = { ...newData[index], [field]: value };
    setFormData((prev) => ({ ...prev, data: newData }));
  };

  // Add member
  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        {
          id: Date.now().toString(),
          name: "",
          position: "",
          imageurl: "",
          number: "",
        },
      ],
    }));
  };

  // Delete member
  const handleDeleteMember = (index: number) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, data: newData }));
  };

  // Save to DB
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/teamsection/update", {
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

  // ✅ Handle Image Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
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

      if (data?.secure_url) {
        handleMemberChange(index, "imageurl", data.secure_url);
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

  // ✅ Handle Image Delete
  const handleImageDelete = async (index: number) => {
    const member = formData.data[index];
    if (!member.imageurl) return;

    setUploading(true);
    toast.loading("Deleting image...", { id: "delete" });

    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: member.imageurl }),
      });

      handleMemberChange(index, "imageurl", "");
      toast.dismiss("delete");
      toast.success("Image deleted successfully!");
    } catch (err: any) {
      toast.dismiss("delete");
      toast.error(err.message || "Delete failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <Background id="team">
      <div className="container mx-auto">
        {/* Heading */}
        {isEditing ? (
          <div className="flex flex-col space-y-2 mb-6">
            <input
              type="text"
              value={formData.heading.title}
              onChange={(e) => handleHeadingChange("title", e.target.value)}
              placeholder="Heading Title"
              className="w-full p-2 border rounded-md text-center"
            />
            <input
              type="text"
              value={formData.heading.subTitle}
              onChange={(e) => handleHeadingChange("subTitle", e.target.value)}
              placeholder="Heading Subtitle"
              className="w-full p-2 border rounded-md text-center"
            />
          </div>
        ) : (
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
        )}

        <div className="flex gap-4 mb-4">
          <Button onClick={handleAddMember}>Add Member</Button>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Team Grid */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {formData.data.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-between"
            >
              {isEditing ? (
                <div className="flex flex-col space-y-2 w-full">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                    placeholder="Name"
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    value={member.position}
                    onChange={(e) =>
                      handleMemberChange(index, "position", e.target.value)
                    }
                    placeholder="Position"
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    value={member.number}
                    onChange={(e) =>
                      handleMemberChange(index, "number", e.target.value)
                    }
                    placeholder="Phone / Whatsapp"
                    className="w-full p-2 border rounded-md"
                  />

                  {/* Image Upload */}
                  <div className="flex flex-col items-center gap-2">
                    {member.imageurl && (
                      <img
                        src={member.imageurl}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="w-full"
                    />
                    {member.imageurl && (
                      <Button onClick={() => handleImageDelete(index)}>
                        Delete Image
                      </Button>
                    )}
                  </div>

                  <Button onClick={() => handleDeleteMember(index)}>
                    Delete Member
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Background>
  );
};
