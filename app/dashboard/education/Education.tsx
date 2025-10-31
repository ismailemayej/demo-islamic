"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface Education {
  id: number;
  examName: string;
  institution: string;
  year: string;
  result: string;
  duration: string;
}

const EDUCATION_DATA: Education[] = [
  {
    id: 1,
    examName: "দাখিল",
    institution: "হানসা ফাজিল মাদরাসা",
    year: "২০১২",
    result: "GPA 4.42",
    duration: "২ বছর",
  },
  {
    id: 2,
    examName: "আলিম",
    institution: "হানসা ফাজিল মাদরাসা",
    year: "২০১৪",
    result: "GPA 4.42",
    duration: "২ বছর",
  },
  {
    id: 3,
    examName: "ফাযিল (অনার্স)",
    institution: "ফরিদগঞ্জ মজিদিয়া কামিল মাদরাসা",
    year: "২০১৮",
    result: "GPA 3.67 / 4.00",
    duration: "৪ বছর",
  },
  {
    id: 4,
    examName: "কামিল (মাস্টার্স)",
    institution: "ফরিদগঞ্জ মজিদিয়া কামিল মাদরাসা",
    year: "২০১৯",
    result: "GPA 3.30 / 4.00",
    duration: "১ বছর",
  },
  {
    id: 5,
    examName: "কামিল (মাস্টার্স)",
    institution: "ফরিদগঞ্জ মজিদিয়া কামিল মাদরাসা",
    year: "২০১৯",
    result: "GPA 3.30 / 4.00",
    duration: "১ বছর",
  },
];

export const EducationSectionDashboard: React.FC = () => {
  return (
    <section
      id="education"
      className="py-16 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <Heading
        title="শিক্ষাগত যোগ্যতা"
        subTitle="আমার একাডেমিক অর্জনসমূহ নিচে দেওয়া হলো"
        center
      />

      <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EDUCATION_DATA.map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: edu.id * 0.1 }}
            className="relative p-6 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 hover:shadow-lg rounded-2xl border border-amber-100 dark:border-gray-700 transition-colors duration-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              <h3 className="bangla text-xl font-semibold text-amber-800 dark:text-amber-400">
                {edu.examName}
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
    </section>
  );
};
