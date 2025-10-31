"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { Heading } from "@/components/Heading";

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "1",
    name: "Facebook",
    url: "https://www.facebook.com/yourprofile",
    icon: <FaFacebookF />,
  },
  {
    id: "2",
    name: "Twitter",
    url: "https://twitter.com/yourprofile",
    icon: <FaTwitter />,
  },
  {
    id: "3",
    name: "Instagram",
    url: "https://www.instagram.com/yourprofile",
    icon: <FaInstagram />,
  },
  {
    id: "4",
    name: "YouTube",
    url: "https://www.youtube.com/@yourchannel",
    icon: <FaYoutube />,
  },
  {
    id: "5",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yourprofile",
    icon: <FaLinkedinIn />,
  },
];

export const SocialMediaSectionDashboard: React.FC = () => {
  return (
    <section
      id="social"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <Heading
          title="যোগাযোগের মাধ্যম"
          subTitle="আমাদের সামাজিক যোগাযোগ মাধ্যমে অনুসরণ করুন এবং সর্বশেষ আপডেট পান"
        />

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {SOCIAL_LINKS.map((social, index) => (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 group"
            >
              <div className="text-3xl text-emerald-700 dark:text-emerald-400 mb-3 group-hover:text-amber-500 transition-colors">
                {social.icon}
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
