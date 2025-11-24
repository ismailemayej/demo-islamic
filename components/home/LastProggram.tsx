"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import { Clock, CheckCircle, Calendar, MapPin, User } from "lucide-react";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";
import Loader from "../loader";

interface Program {
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

export const RecentProgramsSection: React.FC = () => {
  const { section, loading } = useGetSection<any>("programsection");
  const today = new Date();
  const MOCK_PROGRAMS = section?.data || [];

  const calculateRemainingDays = (programDate: Date) => {
    const diffTime = programDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `${diffDays} দিন বাকি`;
    if (diffDays === 1) return "আগামীকাল";
    if (diffDays === 0) return "আজই অনুষ্ঠিত হবে";
    return "সম্পন্ন হয়েছে";
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Background id="programs">
          <Heading
            title={section?.heading?.title || "প্রোগ্রাম"}
            subTitle={
              section?.heading?.subTitle ||
              "আমাদের সাম্প্রতিক ইসলামিক প্রোগ্রামের তালিকা"
            }
          />

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 mt-10">
            {MOCK_PROGRAMS?.slice(0, 5)
              ?.reverse()
              .map((program: Program, index: number) => {
                const programDate = new Date(program.date);
                const remainingDays = calculateRemainingDays(programDate);
                const isUpcoming = programDate >= today;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.06, rotateX: 2, rotateY: -2 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    className="relative bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer border border-emerald-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* Top Icons & Program Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-amber-500 text-2xl">🕌</span>
                      <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                        {program.programName}
                      </h3>
                    </div>

                    {/* Program Details with Icons */}
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold">নামঃ</span>{" "}
                        {program.name}
                      </p>
                      <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold">স্থানঃ</span>{" "}
                        {program.location}
                      </p>
                      <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">তারিখঃ</span>{" "}
                        {program.date}
                      </p>
                      <p className="flex items-center text-gray-700 dark:text-gray-200 gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold">বারঃ</span>{" "}
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
        </Background>
      )}
    </>
  );
};
