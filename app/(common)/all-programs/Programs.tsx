"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, Calendar, MapPin, ArrowRight } from "lucide-react";

import type { RecentProgramItem } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";

export const AllProgramsSection = () => {
  const { section } = useGetSection<any>("programsection");
  if (!section) return <Spinner size="lg" />;

  const today = new Date();
  const programs: RecentProgramItem[] = [...(section?.data || [])].reverse();

  // Remaining days logic
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
      {/* Heading + More Button */}

      <Heading
        title={section?.heading?.title || "প্রোগ্রাম"}
        subTitle={
          section?.heading?.subTitle ||
          "আমাদের সাম্প্রতিক ইসলামিক প্রোগ্রামের তালিকা"
        }
      />

      {/* Program Grid */}
      <div className="w-full grid gap-3 md:grid-cols-3 lg:grid-cols-6 mt-10">
        {programs.map((program, index) => {
          const programDate = new Date(program.date);
          const remainingDays = calculateRemainingDays(programDate);
          const isUpcoming = programDate >= today;

          return (
            <motion.div
              key={program.id || index}
              className={`
                relative rounded-2xl p-5 shadow-lg 
                flex flex-col gap-2 cursor-pointer border transition-all
                ${
                  isUpcoming
                    ? "bg-white/60 dark:bg-gray-800/40 border-emerald-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1"
                    : "bg-gray-200/50 dark:bg-gray-700/40 border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed"
                }
              `}
            >
              {/* Program Title */}
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 text-center">
                {program.programName}
              </h3>

              {/* Program Details */}
              <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2 text-sm">
                <MapPin className="w-4 h-4 text-amber-500" />
                {program.location}
              </p>

              <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                {program.date}
              </p>

              <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2 text-sm">
                <Clock className="w-4 h-4 text-emerald-500" />
                {program.day}
              </p>

              {/* Status / Button */}
              {isUpcoming ? (
                <motion.div
                  className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-emerald-600 text-white dark:bg-emerald-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-4 h-4" />
                  {remainingDays}
                </motion.div>
              ) : (
                <div className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-gray-500 text-white dark:bg-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  সম্পন্ন হয়েছে
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Background>
  );
};
