"use client";
import { motion } from "framer-motion";
import { User2, FileText, Info } from "lucide-react";
import profile from "@/public/images/profile.png";
import { Heading } from "../Heading";
import Background from "../background";

import { Button } from "@heroui/button";
import Link from "next/link";

type AboutProps = {
  section?: {
    heading: {
      title: string;
      subTitle: string;
    };
    data: {
      title: string;
      image: string;
      description: string;
    };
  };
};
export const AboutSection: React.FC<AboutProps> = ({ section }) => {
  return (
    <Background id="about">
      {/* Heading */}
      <Heading
        title={section?.heading.title || "About Me"}
        subTitle={section?.heading.subTitle || "Who I Am"}
      />

      <div
        className="mx-auto flex flex-col lg:flex-row items-center gap-12 mt-10"
        style={{ perspective: "1000px" }}
      >
        {/* Left Side: 3D Profile Image */}
        <motion.div
          initial={{ opacity: 0, rotateY: -10 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          whileHover={{ rotateY: 10, scale: 1.05 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/3 flex justify-center lg:justify-start"
        >
          <div className="relative group shadow-2xl rounded-3xl overflow-hidden w-64 sm:w-72 md:w-80 border border-gray-200 dark:border-gray-700 transition-all duration-500">
            <motion.img
              src={section?.data?.image || profile.src}
              alt={section?.data?.title || "Profile Image"}
              className="w-full h-auto object-cover rounded-3xl group-hover:scale-110 transition-transform duration-700"
            />
            {/* Glow Effect */}
            <motion.div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </motion.div>

        {/* Right Side: 3D Content with Icons */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-2/3 space-y-6"
        >
          {/* Title with 3D Icon */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <User2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 drop-shadow-lg" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed bangla">
              {section?.data?.title || "আমার সম্পর্কে"}
            </h1>
          </motion.div>

          {/* Description with File Icon */}
          <motion.div
            className="flex items-start gap-3"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FileText className="w-9 h-9 text-amber-500 drop-shadow-md mt-1" />
            <p
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed bangla line-clamp-5"
              dangerouslySetInnerHTML={{
                __html:
                  section?.data?.description ||
                  "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
              }}
            ></p>
          </motion.div>

          {/* More Info Button with 3D Hover */}
          <motion.div
            whileHover={{ scale: 1.05, rotateX: 8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <Link href="/about-me">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 
                text-white rounded-full shadow-xl bangla flex items-center gap-2 px-6"
              >
                <Info className="w-5 h-5" />
                বিস্তারিত দেখুন
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Background>
  );
};
