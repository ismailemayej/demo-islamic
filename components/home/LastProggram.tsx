"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import { CheckCircle, Clock } from "lucide-react";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";
import { ThreeDButton } from "../ThreeDbutton";

interface Program {
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

export const RecentProgramsSection: React.FC = () => {
  const { section, loading, error } = useGetSection<any>("programsection");
  const today = new Date();
  const MOCK_PROGRAMS = section?.data || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
      <div className="container mx-auto px-0 bangla">
        <Heading
          title={section?.heading?.title || "প্রোগ্রাম"}
          subTitle={
            section?.heading?.subTitle ||
            "আমাদের সাম্প্রতিক ইসলামিক প্রোগ্রামের তালিকা"
          }
        />

        <div className="grid gap-6 md:grid-cols-5 mt-10">
          {MOCK_PROGRAMS.map((program: Program, index: number) => {
            const programDate = new Date(program.date);
            const remainingDays = calculateRemainingDays(programDate);
            const isUpcoming = programDate >= today;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateX: 3, rotateY: -3 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col justify-between h-full relative cursor-pointer"
              >
                {/* Top Icon & Program Name */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-500 text-xl">🕌</span>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {program.programName}
                  </h3>
                </div>

                {/* Program Details */}
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">নামঃ</span> {program.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">স্থানঃ</span>{" "}
                    {program.location}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">
                    <span className="font-semibold">তারিখঃ</span> {program.date}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">বারঃ</span> {program.day}
                  </p>
                </div>

                {/* Status & Button */}
                <div className="mt-4 flex flex-col gap-2">
                  <motion.div
                    className={`w-full py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold ${
                      isUpcoming
                        ? "bg-emerald-600 text-white dark:bg-emerald-500"
                        : "bg-gray-400 text-white dark:bg-gray-600"
                    }`}
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Background>
  );
};
