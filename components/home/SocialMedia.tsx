"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPinterest,
  FaSnapchatGhost,
  FaRedditAlien,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

// ✅ Social options (reference)
const SOCIAL_OPTIONS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "Pinterest",
  "Snapchat",
  "Reddit",
  "TikTok",
  "WhatsApp",
];

interface SocialItem {
  name: string;
  url: string;
  icon: string; // string name (e.g. "Facebook")
}

export const SocialMediaSection: React.FC = () => {
  const { section } = useGetSection<any>("socialmediasection");
  const SOCIAL_LINKS: SocialItem[] = section?.data || [];

  // 🧠 Return icon based on string name
  const getSocialIcon = (iconName: string): ReactNode => {
    switch (iconName.toLowerCase()) {
      case "facebook":
        return <FaFacebookF />;
      case "twitter":
        return <FaTwitter />;
      case "instagram":
        return <FaInstagram />;
      case "youtube":
        return <FaYoutube />;
      case "linkedin":
        return <FaLinkedinIn />;
      case "pinterest":
        return <FaPinterest />;
      case "snapchat":
        return <FaSnapchatGhost />;
      case "reddit":
        return <FaRedditAlien />;
      case "tiktok":
        return <FaTiktok />;
      case "whatsapp":
        return <FaWhatsapp />;
      default:
        return <FaFacebookF />; // fallback icon
    }
  };

  return (
    <section
      id="social"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <Heading
          title={section?.heading?.title || "যোগাযোগের মাধ্যম"}
          subTitle={
            section?.heading?.subTitle ||
            "আমাদের সামাজিক যোগাযোগ মাধ্যমে অনুসরণ করুন এবং সর্বশেষ আপডেট পান"
          }
        />

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {SOCIAL_LINKS.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 group"
            >
              <div className="text-5xl text-emerald-700 dark:text-emerald-400 mb-3 group-hover:text-amber-500 transition-colors">
                {getSocialIcon(social.icon)}
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
