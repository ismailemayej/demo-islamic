"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import {
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  ArrowRight,
} from "lucide-react";
import Background from "../background";
import type { RecentProgramItem, TProgramSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";

interface RecentProgramsProps {
  section?: TProgramSection;
  data?: RecentProgramItem[];
}

export const RecentProgramsSection: React.FC<RecentProgramsProps> = ({
  section,
}) => {
  if (!section) {
    return <Spinner size="lg" />;
  }
  const today = new Date();
  const MOCK_PROGRAMS: RecentProgramItem[] = section?.data || [];

  const calculateRemainingDays = (programDate: Date) => {
    const diffTime = programDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `${diffDays} দিন বাকি`;
    if (diffDays === 1) return "আগামীকাল";
    if (diffDays === 0) return "আজই অনুষ্ঠিত হবে";
    return "সম্পন্ন হয়েছে";
  };

  return (
    <Background id="programs">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 text-center">
            <Heading
              title={section?.heading?.title || "প্রোগ্রাম"}
              subTitle={
                section?.heading?.subTitle ||
                "আমাদের সাম্প্রতিক ইসলামিক প্রোগ্রামের তালিকা"
              }
            />
          </div>
          <span className="lg:block hidden">
            <Link
              href="/all-programs"
              className="
      flex items-center gap-1 font-medium
      text-blue-600 dark:text-blue-400
      hover:underline
      "
            >
              More
              <ArrowRight
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
            </Link>
          </span>
        </div>
      </div>

      <div className="w-full grid gap-3 md:grid-cols-3 lg:grid-cols-5 mt-10">
        {MOCK_PROGRAMS.slice(0, 5)
          .reverse()
          .map((program: RecentProgramItem, index: number) => {
            const programDate = new Date(program.date);
            const remainingDays = calculateRemainingDays(programDate);
            const isUpcoming = programDate >= today;

            return (
              <motion.div
                key={program.id || index}
                className="relative bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer border border-emerald-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Top Icons & Program Name */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-center text-emerald-700 dark:text-emerald-400">
                    {program.programName}
                  </h3>
                </div>

                {/* Program Details with Icons */}
                <div className="flex flex-col gap-2 flex-1">
                  <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />

                    {program.location}
                  </p>
                  <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {program.date}
                  </p>
                  <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {program.day}
                  </p>
                </div>

                {/* Status Badge */}
                <motion.div
                  className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm ${
                    isUpcoming
                      ? "bg-emerald-600 text-white dark:bg-emerald-500"
                      : "bg-gray-400 text-white dark:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {isUpcoming ? (
                    <>
                      <Clock className="w-4 h-4" />
                      {remainingDays}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {remainingDays}
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
      </div>
      <span className="flex justify-end  lg:hidden mt-1">
        <Link
          href="/all-programs"
          className="
      flex items-center gap-1 font-medium
      text-blue-600 dark:text-blue-400
      hover:underline lg:block
      "
        >
          More
          <ArrowRight size={18} className="text-blue-600 dark:text-blue-400" />
        </Link>
      </span>
    </Background>
  );
};
