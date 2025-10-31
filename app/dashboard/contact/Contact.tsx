"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";

interface ContactItem {
  id: string;
  title: string;
  value: string;
  url?: string;
  icon: React.ReactNode;
  color?: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: "1",
    title: "মোবাইল",
    value: "+8801858226967",
    url: "tel:+8801858226967",
    icon: <FaPhoneAlt />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    id: "2",
    title: "ইমেইল",
    value: "ismaile535@gmail.com",
    url: "mailto:ismaile535@gmail.com",
    icon: <FaEnvelope />,
    color: "text-red-500 dark:text-red-400",
  },
  {
    id: "3",
    title: "ঠিকানা",
    value: "East Hansa, Faridgonj, Chandpur, Bangladesh",
    icon: <FaMapMarkerAlt />,
    color: "text-amber-500 dark:text-amber-400",
  },
  {
    id: "4",
    title: "WhatsApp",
    value: "+8801858226967",
    url: "https://wa.me/8801858226967",
    icon: <FaWhatsapp />,
    color: "text-green-500 dark:text-green-400",
  },
];

export const ContactSectionDashboard: React.FC = () => {
  return (
    <Background id="contact">
      <div className="container mx-auto">
        <Heading
          title="যোগাযোগের মাধ্যম"
          subTitle="নিচের মাধ্যমে আমাদের সঙ্গে যোগাযোগ করতে পারেন"
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CONTACT_ITEMS.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url || "#"}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-700 hover:shadow-2xl hover:scale-105 transition-transform duration-300 group"
            >
              <div
                className={`text-4xl mb-3 transition-colors group-hover:text-amber-500 ${item.color || "text-emerald-700 dark:text-emerald-300"}`}
              >
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-lg">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-1 text-sm break-words">
                {item.value}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </Background>
  );
};
