"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { useGetSection } from "../Hook/GetData";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface ContactData {
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}

interface ContactSection {
  heading: {
    title: string;
    subTitle: string;
  };
  data: ContactData;
}

export const ContactSectionDashboard: React.FC = () => {
  const { section, loading, error } =
    useGetSection<ContactData>("contactsection");
  console.log("Contact Section Data:", section);

  const [formData, setFormData] = useState<ContactSection>({
    heading: { title: "", subTitle: "" },
    data: { email: "", phone: "", address: "", mapUrl: "" },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        heading: section.heading || { title: "", subTitle: "" },
        data: section.data || { email: "", phone: "", address: "", mapUrl: "" },
      });
    }
  }, [section]);

  const handleChange = (
    type: "heading" | "data",
    field: string,
    value: string
  ) => {
    if (type === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: { ...prev.heading, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        data: { ...prev.data, [field]: value },
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });

    try {
      const res = await fetch("/api/all-data/contactsection/update", {
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

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <Background id="contact">
      <div className="container mx-auto text-center">
        {/* Heading Section */}
        <div className="flex justify-between items-center mb-5">
          {isEditing ? (
            <div className="flex flex-col w-full space-y-2">
              <Input
                size="md"
                type="text"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="w-full p-2 border rounded-md text-center dark:bg-gray-800 dark:text-white"
                label="Heading Title"
              />
              <Input
                size="md"
                type="text"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="w-full p-2 border rounded-md text-center dark:bg-gray-800 dark:text-white"
                label="Heading Subtitle"
              />
            </div>
          ) : (
            <Heading
              title={formData.heading.title}
              subTitle={formData.heading.subTitle}
            />
          )}

          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="ml-4"
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Contact Items */}
        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Phone */}
          <ContactCard
            icon={<FaPhoneAlt />}
            title="Phone"
            value={
              isEditing ? (
                <Input
                  size="md"
                  type="text"
                  value={formData.data.phone}
                  onChange={(e) =>
                    handleChange("data", "phone", e.target.value)
                  }
                  className="w-full text-center bg-transparent border-b border-emerald-500 outline-none dark:text-white"
                />
              ) : (
                <a
                  href={`https://wa.me/${formData.data.phone.replace("+", "")}`}
                  target="_blank"
                  className="hover:text-emerald-600"
                >
                  {formData.data.phone}
                </a>
              )
            }
          />

          {/* WhatsApp */}
          <ContactCard
            icon={<FaWhatsapp />}
            title="WhatsApp"
            value={
              <a
                href={`https://wa.me/${formData.data.phone.replace("+", "")}`}
                target="_blank"
                className="hover:text-green-500"
              >
                Message on WhatsApp
              </a>
            }
          />

          {/* Email */}
          <ContactCard
            icon={<FaEnvelope />}
            title="Email"
            value={
              isEditing ? (
                <Input
                  size="md"
                  type="email"
                  value={formData.data.email}
                  onChange={(e) =>
                    handleChange("data", "email", e.target.value)
                  }
                  className="w-full text-center bg-transparent border-b border-emerald-500 outline-none dark:text-white"
                />
              ) : (
                <a
                  href={`mailto:${formData.data.email}`}
                  className="hover:text-blue-500"
                >
                  {formData.data.email}
                </a>
              )
            }
          />

          {/* Address */}
          <ContactCard
            icon={<FaMapMarkerAlt />}
            title="Address"
            value={
              isEditing ? (
                <Input
                  size="md"
                  type="text"
                  value={formData.data.address}
                  onChange={(e) =>
                    handleChange("data", "address", e.target.value)
                  }
                  className="w-full text-center bg-transparent border-b border-emerald-500 outline-none dark:text-white"
                />
              ) : (
                <a
                  href={formData.data.mapUrl}
                  target="_blank"
                  className="hover:text-amber-600"
                >
                  {formData.data.address}
                </a>
              )
            }
          />
        </motion.div>
      </div>
    </Background>
  );
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

const ContactCard: React.FC<ContactCardProps> = ({ icon, title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300"
    >
      <div className="text-4xl mb-3 text-emerald-600">{icon}</div>
      <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-1">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 text-center text-sm break-words">
        {value}
      </p>
    </motion.div>
  );
};
