"use client";

import { motion } from "framer-motion";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { useState, useEffect } from "react";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";
import { Button, Input, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import JoditEditor from "jodit-react";
import RichSimpleEditor from "@/components/SimpleEditor";

const FA_ICONS = [
  "fa-mosque",
  "fa-star",
  "fa-users",
  "fa-graduation-cap",
  "fa-book",
  "fa-chalkboard-teacher",
  "fa-laptop-code",
  "fa-bullhorn",
  "fa-hands-helping",
];

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

export const ServiceSectionDashboard: React.FC = () => {
  const { section, loading } = useGetSection("servicesection");
  const editor = JoditEditor as any;

  const [formData, setFormData] = useState<any>({
    heading: { title: "", subTitle: "" },
    data: [],
  });

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [iconQuery, setIconQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditingHeading, setIsEditingHeading] = useState(false);

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

  const handleHeadingSave = async () => {
    setSaving(true);
    toast.loading("Saving...", { id: "heading_save" });
    try {
      const res = await fetch("/api/all-data/servicesection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      toast.success("Heading updated successfully!", { id: "heading_save" });
      setIsEditingHeading(false);
    } catch (err: any) {
      toast.error(err.message || "Save failed", { id: "heading_save" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      icon: "fa-star",
      title: "New Service",
      shortDescription: "Short description here...",
      fullDescription: "Full description here...",
    };
    setSelectedService(newItem);
    setIconQuery(newItem.icon);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    const updated = {
      ...formData,
      data: formData.data.filter((item: ServiceItem) => item.id !== id),
    };
    setFormData(updated);
    handleSave(updated);
    toast.success("Deleted successfully!");
  };

  const handleModalSave = () => {
    if (!selectedService) return;
    const exists = formData.data.some(
      (s: ServiceItem) => s.id === selectedService.id
    );
    const updatedList = exists
      ? formData.data.map((s: ServiceItem) =>
          s.id === selectedService.id ? selectedService : s
        )
      : [...formData.data, selectedService];

    const updated = { ...formData, data: updatedList };
    setFormData(updated);
    handleSave(updated);
    setOpenModal(false);
  };

  const handleSave = async (updated = formData) => {
    setSaving(true);
    toast.loading("Saving...", { id: "service_save" });
    try {
      const res = await fetch("/api/all-data/servicesection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Saved successfully!", { id: "service_save" });
      setOpenModal(false);
      setShowSuggestions(false);
    } catch (err: any) {
      toast.error(err.message || "Save failed", { id: "service_save" });
    } finally {
      setSaving(false);
    }
  };

  const openDetailsModal = (service: ServiceItem) => {
    setSelectedService(service);
    setIconQuery(service.icon);
    setOpenModal(true);
  };

  const filteredIcons = FA_ICONS.filter((icon) =>
    icon.toLowerCase().includes(iconQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <Background id="services">
      <div className="flex justify-between items-center mb-6">
        {isEditingHeading ? (
          <div className="flex gap-2 flex-col sm:flex-row w-full items-start">
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
              label="SubTitle"
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
              onPress={handleHeadingSave}
              isLoading={saving}
            >
              Save
            </Button>
            <Button color="danger" onPress={() => setIsEditingHeading(false)}>
              Cancel
            </Button>
          </div>
        ) : (
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
                onClick={handleAddNew}
              />
              <FaRegEdit
                className="text-yellow-500 cursor-pointer w-7 h-6"
                onClick={() => setIsEditingHeading(true)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {formData.data?.reverse()?.map((service: ServiceItem) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-5xl text-emerald-600 dark:text-emerald-400 mb-2">
                <i className={`fas ${service.icon}`}></i>
              </div>

              <h3
                className="text-xl font-semibold cursor-pointer hover:text-emerald-500 transition"
                onClick={() => openDetailsModal(service)}
              >
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.shortDescription}
              </p>
            </div>

            <div className="absolute top-3 right-3 flex gap-2   transition">
              <motion.button
                onClick={() => openDetailsModal(service)}
                whileHover={{ scale: 1.2 }}
              >
                <FaRegEdit className="text-yellow-500 cursor-pointer w-5 h-6" />
              </motion.button>
              <motion.button
                onClick={() => handleDelete(service.id)}
                whileHover={{ scale: 1.2 }}
              >
                <BsTrash3Fill className="text-rose-500 cursor-pointer w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedService && (
        <OpenModal
          title={selectedService.title}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          size="lg"
        >
          <div className="flex flex-col gap-4 relative">
            <Input
              label="Icon"
              placeholder="fa-mosque / fa-star / fa-users"
              value={iconQuery}
              onChange={(e) => {
                setIconQuery(e.target.value);
                if (selectedService)
                  setSelectedService({
                    ...selectedService,
                    icon: e.target.value,
                  });
                setShowSuggestions(true);
              }}
              fullWidth
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />

            {showSuggestions && filteredIcons.length > 0 && (
              <div className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg w-full mt-1 max-h-48 overflow-auto shadow-lg">
                {filteredIcons.map((icon) => (
                  <div
                    key={icon}
                    className="p-2 hover:bg-emerald-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setIconQuery(icon);
                      if (selectedService)
                        setSelectedService({ ...selectedService, icon });
                      setShowSuggestions(false);
                    }}
                  >
                    <i className={`fas ${icon}`}></i>
                    <span className="ml-2">{icon}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-6xl text-center text-emerald-600 dark:text-emerald-400 mt-2">
              <i className={`fas ${selectedService.icon}`}></i>
            </div>

            <Input
              label="Title"
              placeholder="Service Title"
              value={selectedService.title}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  title: e.target.value,
                })
              }
              fullWidth
            />

            <Textarea
              label="Short Description"
              placeholder="Short Description"
              value={selectedService.shortDescription}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  shortDescription: e.target.value,
                })
              }
              fullWidth
            />
            <RichSimpleEditor
              initialValue={selectedService.fullDescription}
              onChange={(newContent: string) =>
                setSelectedService({
                  ...selectedService,
                  fullDescription: newContent,
                })
              }
              className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
            />

            <Button
              color="success"
              onPress={handleModalSave}
              isLoading={saving}
              fullWidth
            >
              Save Service
            </Button>
          </div>
        </OpenModal>
      )}
    </Background>
  );
};
