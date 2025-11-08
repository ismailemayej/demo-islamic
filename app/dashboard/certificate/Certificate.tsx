"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { Award, Edit2, Loader2 } from "lucide-react";
import { useGetSection } from "../Hook/GetData";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";

interface Certificate {
  _id: string;
  title?: string;
  institution: string;
  degree: string;
  year?: string;
  board?: string;
  gpa?: string;
}

export const CertificateSectionDashboard: React.FC = () => {
  const { section, loading, error } = useGetSection("educationsection");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCert) return;
    setSelectedCert({ ...selectedCert, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!selectedCert) return;
    setSaving(true);
    try {
      const res = await fetch("/api/all-data/educationsection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCert),
      });

      if (res.ok) {
        toast.success("Certificate updated successfully!");

        setIsOpen(false);
      } else {
        toast.error("Failed to update certificate!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="certificates"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <Toaster />
      <div className="container mx-auto bangla">
        <Heading
          title={section?.heading?.title}
          subTitle={section?.heading?.subTitle}
        />

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {section?.data?.map((cert: Certificate, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="relative bg-emerald-50 dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
            >
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(cert)}
                className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-md"
              >
                <Edit2 size={16} />
              </button>

              {/* Degree */}
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {cert?.degree}
                </h3>
              </div>

              {/* Certificate Info */}
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">প্রতিষ্ঠানঃ</span>{" "}
                {cert?.institution}
              </p>

              {cert?.board && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">বোর্ডঃ</span> {cert.board}
                </p>
              )}

              {cert?.gpa && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">গ্রেডঃ</span> {cert.gpa}
                </p>
              )}

              <p className="text-gray-700 mb-2">
                <span className="font-semibold">সালঃ</span> {cert.year}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>সার্টিফিকেট সম্পাদনা করুন</ModalHeader>
          <ModalBody>
            <Input
              name="degree"
              label="ডিগ্রি"
              value={selectedCert?.degree || ""}
              onChange={handleChange}
            />
            <Input
              name="institution"
              label="প্রতিষ্ঠান"
              value={selectedCert?.institution || ""}
              onChange={handleChange}
            />
            <Input
              name="board"
              label="বোর্ড"
              value={selectedCert?.board || ""}
              onChange={handleChange}
            />
            <Input
              name="gpa"
              label="গ্রেড"
              value={selectedCert?.gpa || ""}
              onChange={handleChange}
            />
            <Input
              name="year"
              label="সাল"
              value={selectedCert?.year || ""}
              onChange={handleChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              বাতিল
            </Button>
            <Button
              color="success"
              onPress={handleSave}
              disabled={saving}
              startContent={saving && <Loader2 className="animate-spin" />}
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};
