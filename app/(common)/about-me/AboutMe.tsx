"use client";

import { motion } from "framer-motion";
import profile from "@/public/images/profile.png";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";

export const AboutMe: React.FC = () => {
  const { section } = useGetSection("aboutsection");

  return (
    <Background id="about">
      {/* Heading */}
      <Heading
        title={section?.heading.title || "About Me"}
        subTitle={section?.heading.subTitle || "Learn more about me"}
      />

      <div className="container mt-10 flex flex-col lg:flex-row items-start justify-start gap-8">
        {/* Image (left on large screen, top on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center lg:justify-start w-full lg:w-1/3"
        >
          <img
            src={section?.data?.image || profile.src}
            alt={section?.data?.title || "Profile Image"}
            className="rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 w-56 sm:w-64 md:w-72 lg:w-80 object-cover"
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 bangla">
            {section?.data?.title || "About Me"}
          </h1>

          <p
            className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed bangla text-left"
            dangerouslySetInnerHTML={{
              __html:
                section?.data?.description ||
                "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
            }}
          ></p>
        </motion.div>
      </div>
    </Background>
  );
};
