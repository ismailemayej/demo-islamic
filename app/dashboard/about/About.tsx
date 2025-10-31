"use client";

import { motion } from "framer-motion";
import profile from "@/public/images/profile.png";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";

export const AboutSectionDashboard: React.FC = () => {
  return (
    <Background id="about">
      {/* Heading */}
      <Heading
        title="আমাদের সম্পর্কে"
        subTitle="মাওলানা মিজানুর রহমান আল-আযহারী"
      />

      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 mt-10">
        {/* Left Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-1/3 flex justify-center lg:justify-start"
        >
          <div className=" shadow-lg rounded-3xl overflow-hidden w-64 sm:w-72 md:w-80 border border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <div className="p-0 dark:text-white">
              <img
                src={profile.src}
                alt="মাওলানা মিজানুর রহমান আল-আযহারী"
                className="w-full h-auto object-cover "
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-2/3 space-y-4"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">
            মাওলানা মিজানুর রহমান আল-আযহারী একজন সুপরিচিত ইসলামিক আলেম ও বক্তা।
            তিনি কুরআন ও সুন্নাহ-এর জ্ঞান ছড়িয়ে দিতে কাজ করছেন বহু বছর ধরে।
          </p>

          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors duration-500">
            <li>দাওরায় হাদিস এবং ফিকহের উচ্চতর শিক্ষা</li>
            <li>বাংলাদেশের বিভিন্ন মাদ্রাসায় শিক্ষকতা অভিজ্ঞতা</li>
            <li>আন্তর্জাতিক দাওয়াতি প্রোগ্রামে বক্তৃতা</li>
          </ul>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">
            তিনি নিয়মিত বক্তৃতা ও দাওয়াতি কার্যক্রম পরিচালনা করেন এবং ইসলামের
            আলোয় জীবন আলোকিত করতে সচেষ্ট।
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">
            মাওলানা মিজানুর রহমান আল-আযহারী বিশ্বাস করেন যে ইসলামের জ্ঞান সহজে
            মানুষের হৃদয়ে পৌঁছানো উচিত।
          </p>
        </motion.div>
      </div>
    </Background>
  );
};
