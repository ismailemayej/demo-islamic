"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Heading } from "../Heading";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";
import Loader from "../loader";

interface Education {
  id: number;
  examName: string;
  institution: string;
  year: string;
  result: string;
  duration: string;
}

export const EducationSection: React.FC = () => {
  const { section, loading, error } = useGetSection("educationsection");
  const EDUCATION_DATA = section?.data || [];
  if (loading) {
    return <Loader />;
  }

  return (
    <Background id="education">
      <Heading
        title={section?.heading?.title || "শিক্ষাগত যোগ্যতা"}
        subTitle={
          section?.heading?.subTitle || "আমার একাডেমিক অর্জনসমূহ নিচে দেওয়া হলো"
        }
        center
      />

      <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {EDUCATION_DATA.map((edu: Education, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative p-6 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 hover:shadow-lg rounded-2xl border border-amber-100 dark:border-gray-700 transition-colors duration-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              <h3 className="bangla text-xl font-semibold text-amber-800 dark:text-amber-400">
                {edu?.examName}
              </h3>
            </div>
            <p className="bangla text-gray-800 dark:text-gray-300 font-medium mb-1">
              <span className="text-amber-700 dark:text-amber-500 font-semibold">
                প্রতিষ্ঠান:
              </span>{" "}
              {edu.institution}
            </p>
            <p className="bangla text-gray-700 dark:text-gray-400 mb-1">
              <span className="text-amber-700 dark:text-amber-500 font-semibold">
                সাল:
              </span>{" "}
              {edu.year}
            </p>
            <p className="bangla text-gray-700 dark:text-gray-400 mb-1">
              <span className="text-amber-700 dark:text-amber-500 font-semibold">
                রেজাল্ট:
              </span>{" "}
              {edu.result}
            </p>
            <p className="bangla text-gray-700 dark:text-gray-400">
              <span className="text-amber-700 dark:text-amber-500 font-semibold">
                শিক্ষা সময়:
              </span>{" "}
              {edu.duration}
            </p>
          </motion.div>
        ))}
      </div>
    </Background>
  );
};
