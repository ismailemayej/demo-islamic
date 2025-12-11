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
import Background from "../background";
import { TSocialMediaSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";

const ThreeDCard: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/70 dark:bg-gray-800/50
      backdrop-blur-md shadow-lg hover:shadow-2xl transition-transform duration-300 perspective-1000"
  >
    {children}
  </motion.a>
);

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
type SocialMediaSectionProps = {
  section: TSocialMediaSection | undefined;
};

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  section,
}) => {
  if (!section) {
    return <Spinner size="lg" />;
  }
  const SOCIAL_LINKS = section?.data || [];

  const getIcon = (name: string) => {
    switch (name) {
      case "Facebook":
        return (
          <FaFacebookF className="text-emerald-600 dark:text-emerald-400" />
        );
      case "Twitter":
        return <FaTwitter className="text-emerald-600 dark:text-emerald-400" />;
      case "Instagram":
        return (
          <FaInstagram className="text-emerald-600 dark:text-emerald-400" />
        );
      case "YouTube":
        return <FaYoutube className="text-red-500 dark:text-red-400" />;
      case "LinkedIn":
        return <FaLinkedinIn className="text-blue-600 dark:text-blue-400" />;
      case "Pinterest":
        return <FaPinterestP className="text-red-600 dark:text-red-400" />;
      case "Snapchat":
        return (
          <FaSnapchatGhost className="text-yellow-400 dark:text-yellow-300" />
        );
      case "Reddit":
        return (
          <FaRedditAlien className="text-orange-500 dark:text-orange-400" />
        );
      case "TikTok":
        return <FaTiktok className="text-black dark:text-white" />;
      case "WhatsApp":
        return <FaWhatsapp className="text-green-600 dark:text-green-400" />;
      default:
        return (
          <FaFacebookF className="text-emerald-600 dark:text-emerald-400" />
        );
    }
  };

  return (
    <Background id="social">
      <Heading
        title={section?.heading?.title || "সোস্যাল মিডিয়া"}
        subTitle={
          section?.heading?.subTitle ||
          "আমাদের সামাজিক যোগাযোগ মাধ্যমে অনুসরণ করুন এবং সর্বশেষ আপডেট পান"
        }
      />

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {SOCIAL_LINKS?.map((social: SocialLink, index: number) => {
          const icon = SOCIAL_OPTIONS.includes(social.name) ? (
            getIcon(social.name)
          ) : (
            <FaFacebookF className="text-emerald-600 dark:text-emerald-400" />
          );

          return (
            <ThreeDCard key={index} href={social.url}>
              <motion.div className="text-5xl mb-3">{icon}</motion.div>
              <motion.span className="font-semibold text-gray-700 dark:text-gray-200 text-center">
                {social.name}
              </motion.span>
            </ThreeDCard>
          );
        })}
      </div>
    </Background>
  );
};
