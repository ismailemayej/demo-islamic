"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";
import { useGetSection } from "../Hook/GetData";
import { Plus, Trash2, Save, Edit3, Building2, X } from "lucide-react";
import toast from "react-hot-toast";

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

  const [editHeadingModal, setEditHeadingModal] = useState(false);
  const [editOrgModal, setEditOrgModal] = useState<Organization | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
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

  // ------------ Save Function ------------
  const handleSave = async () => {
    setSaving(true);
    toast.loading("Saving data...", { id: "save" });
    try {
      const res = await fetch("/api/all-data/organizationsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      toast.dismiss("save");
      toast.success("✅ Saved successfully!");
      setEditHeadingModal(false);
      setEditOrgModal(null);
    } catch (err: any) {
      toast.dismiss("save");
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ------------ Handle Change ------------
  const handleChange = (
    type: "heading" | "org",
    field: string,
    value: string,
    id?: string
  ) => {
    if (type === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: { ...prev.heading, [field]: value },
      }));
    } else if (type === "org" && id) {
      setFormData((prev) => ({
        ...prev,
        data: prev.data.map((org) =>
          org.id === id ? { ...org, [field]: value } : org
        ),
      }));
    }
  };

  // ------------ Add & Delete ------------
  const handleAdd = () => {
    const newOrg: Organization = {
      id: Date.now().toString(),
      name: "",
      possition: "",
      address: "",
      director: "",
      img: "",
      details: "",
    };
    setFormData((prev) => ({ ...prev, data: [...prev.data, newOrg] }));
    setEditOrgModal(newOrg);
  };

  const handleDelete = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      data: prev.data.filter((org) => org.id !== id),
    }));
    toast.success("Deleted successfully!");
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
    <section className="relative py-20 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:from-gray-700 dark:to-gray-900 dark:text-gray-200 transition-colors duration-700 bangla">
      <div className="container mx-auto text-center">
        {/* Heading */}
        <div className="flex justify-between items-center mb-6">
          <Heading
            title={formData.heading.title}
            subTitle={formData.heading.subTitle}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setEditHeadingModal(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
            >
              Edit Heading
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus size={18} /> Add New
            </button>
          </div>
        </div>

        {/* Display Organization Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mt-8">
          {formData.data.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="w-full"
            >
              <Card
                isHoverable
                className="relative flex flex-col items-center shadow-lg bg-white/90 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 backdrop-blur-lg rounded-2xl hover:shadow-amber-200 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-3 left-3 bg-amber-100 p-2 rounded-full shadow-sm">
                  <Building2 className="text-amber-600" size={22} />
                </div>

                {org.img && (
                  <img
                    src={org.img}
                    alt={org.name}
                    className="w-full h-40 object-cover rounded-t-2xl"
                    onClick={() => setSelectedOrg(org)}
                  />
                )}

                <CardBody className="text-center py-4">
                  <h4
                    className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                  >
                    {org.name || "Untitled"}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    পজিশন: {org.possition}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    ঠিকানা: {org.address}
                  </p>

                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      onClick={() => setEditOrgModal(org)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Heading Edit Modal */}
        {editHeadingModal && (
          <OpenModal
            title="Edit Section Heading"
            isOpen={editHeadingModal}
            onClose={() => setEditHeadingModal(false)}
            size="md"
          >
            <div className="space-y-3 max-h-[70vh] overflow-y-auto p-2">
              <input
                type="text"
                placeholder="Section Title"
                value={formData.heading.title}
                onChange={(e) =>
                  handleChange("heading", "title", e.target.value)
                }
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Section Subtitle"
                value={formData.heading.subTitle}
                onChange={(e) =>
                  handleChange("heading", "subTitle", e.target.value)
                }
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </OpenModal>
        )}

        {/* Organization Edit Modal */}
        {editOrgModal && (
          <OpenModal
            title="Edit Organization"
            isOpen={!!editOrgModal}
            onClose={() => setEditOrgModal(null)}
            size="lg"
          >
            <div className="space-y-3 max-h-[75vh] overflow-y-auto p-2">
              <input
                type="text"
                placeholder="Organization Name"
                value={editOrgModal.name}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("org", "name", value, editOrgModal.id);
                  setEditOrgModal((prev) =>
                    prev ? { ...prev, name: value } : prev
                  );
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Position"
                value={editOrgModal.possition}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("org", "possition", value, editOrgModal.id);
                  setEditOrgModal((prev) =>
                    prev ? { ...prev, possition: value } : prev
                  );
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Address"
                value={editOrgModal.address}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("org", "address", value, editOrgModal.id);
                  setEditOrgModal((prev) =>
                    prev ? { ...prev, address: value } : prev
                  );
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Director"
                value={editOrgModal.director}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("org", "director", value, editOrgModal.id);
                  setEditOrgModal((prev) =>
                    prev ? { ...prev, director: value } : prev
                  );
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <textarea
                placeholder="Details"
                value={editOrgModal.details}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("org", "details", value, editOrgModal.id);
                  setEditOrgModal((prev) =>
                    prev ? { ...prev, details: value } : prev
                  );
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </OpenModal>
        )}

        {/* View Modal */}
        {selectedOrg && (
          <OpenModal
            title={selectedOrg.name}
            isOpen={!!selectedOrg}
            onClose={() => setSelectedOrg(null)}
            size="lg"
          >
            {selectedOrg.img && (
              <img
                src={selectedOrg.img}
                alt={selectedOrg.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700 dark:text-gray-200">
              <strong>পরিচালক:</strong> {selectedOrg.director}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-1">
              <strong>ঠিকানা:</strong> {selectedOrg.address}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-2">
              {selectedOrg.details}
            </p>
          </OpenModal>
        )}
      </div>
    </section>
  );
};
