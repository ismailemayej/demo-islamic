"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaSnapchatGhost,
  FaPinterestP,
  FaRedditAlien,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";

interface SocialLink {
  name: string;
  url: string;
}

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

export const SocialMediaSection: React.FC = () => {
  const { section, loading, error } = useGetSection<any>("socialmediasection");
  const SOCIAL_LINKS = section?.data || [];
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // নাম অনুযায়ী icon সেট করা
  const getIcon = (name: string) => {
    switch (name) {
      case "Facebook":
        return <FaFacebookF />;
      case "Twitter":
        return <FaTwitter />;
      case "Instagram":
        return <FaInstagram />;
      case "YouTube":
        return <FaYoutube />;
      case "LinkedIn":
        return <FaLinkedinIn />;
      case "Pinterest":
        return <FaPinterestP />;
      case "Snapchat":
        return <FaSnapchatGhost />;
      case "Reddit":
        return <FaRedditAlien />;
      case "TikTok":
        return <FaTiktok />;
      case "WhatsApp":
        return <FaWhatsapp />;
      default:
        return <FaFacebookF />; // default icon
    }
  };

  return (
    <Background id="social">
      <div className="container mx-auto px-0">
        <Heading
          title={section?.heading?.title || "সোস্যাল মিডিয়া"}
          subTitle={
            section?.heading?.subTitle ||
            "আমাদের সামাজিক যোগাযোগ মাধ্যমে অনুসরণ করুন এবং সর্বশেষ আপডেট পান"
          }
        />

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {SOCIAL_LINKS?.map((social: SocialLink, index: number) => {
            // নাম যদি SOCIAL_OPTIONS এ না থাকে, default icon দেখাবে
            const icon = SOCIAL_OPTIONS.includes(social.name) ? (
              getIcon(social.name)
            ) : (
              <FaFacebookF />
            );

            return (
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
                  {icon}
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
                  {social.name}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </Background>
  );
};
