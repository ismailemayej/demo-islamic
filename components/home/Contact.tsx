"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import Background from "../background";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Loader from "../loader";

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

const ContactCard: React.FC<ContactItemProps> = ({ icon, title, value }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotateX: 5,
      rotateY: -5,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    }}
    style={{ perspective: 1000 }}
    className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="text-3xl text-emerald-600 dark:text-emerald-400 mb-3">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-200">
      {title}
    </h3>
    <div className="text-gray-600 dark:text-gray-300">{value}</div>
  </motion.div>
);

export const ContactSection: React.FC = () => {
  const { section, loading, error } = useGetSection("contactsection");

  if (loading) return <Loader />;
  if (error || !section) return <p>Error loading contact info</p>;

  const { email, phone, address, mapUrl } = section.data;

  return (
    <Background id="contact">
      <Heading
        title={section.heading?.title || "যোগাযোগের মাধ্যম"}
        subTitle={
          section.heading?.subTitle ||
          "নিচের মাধ্যমে আমাদের সঙ্গে যোগাযোগ করতে পারেন"
        }
      />

      <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Phone */}
        <ContactCard
          icon={<FaPhoneAlt />}
          title="Phone"
          value={
            <a href={`tel:${phone}`} className="hover:text-emerald-600">
              {phone}
            </a>
          }
        />

        {/* WhatsApp */}
        <ContactCard
          icon={<FaWhatsapp />}
          title="WhatsApp"
          value={
            <a
              href={`https://wa.me/${phone.replace("+", "")}`}
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
            <a href={`mailto:${email}`} className="hover:text-blue-500">
              {email}
            </a>
          }
        />

        {/* Address */}
        <ContactCard
          icon={<FaMapMarkerAlt />}
          title="Address"
          value={
            <a href={mapUrl} target="_blank" className="hover:text-amber-600">
              {address}
            </a>
          }
        />
      </motion.div>
    </Background>
  );
};
