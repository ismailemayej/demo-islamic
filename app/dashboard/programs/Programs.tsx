"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";

import { CheckCircle, Clock } from "lucide-react";

interface Program {
  id: string;
  programName: string;
  name: string;
  location: string;
  date: string;
  day: string;
}

const MOCK_PROGRAMS: Program[] = [
  {
    id: "1",
    programName: "ওয়াজ",
    name: "ড. ওমর আল-ফার্সি",
    location: "কুরআন একাডেমি, ঢাকা",
    date: "2025-10-01",
    day: "শনিবার",
  },
  {
    id: "2",
    programName: "ইসলামিক সেমিনার",
    name: "মুহাম্মাদ জসিম",
    location: "মসজিদ নূর, চট্টগ্রাম",
    date: "2025-11-03",
    day: "সোমবার",
  },
  {
    id: "3",
    programName: "কুরআন শিক্ষা কর্মশালা",
    name: "ড. সায়েম রহমান",
    location: "ইসলামিক সেন্টার, সিলেট",
    date: "2025-11-05",
    day: "বুধবার",
  },
  {
    id: "4",
    programName: "ইসলামিক আলোচনা সভা",
    name: "মুফতি রাশিদুল ইসলাম",
    location: "মাদ্রাসা হল, কুমিল্লা",
    date: "2025-11-10",
    day: "সোমবার",
  },
  {
    id: "5",
    programName: "কুরআন শিক্ষা কর্মশালা",
    name: "ড. সায়েম রহমান",
    location: "ইসলামিক সেন্টার, সিলেট",
    date: "2025-10-05",
    day: "বুধবার",
  },
];

export const ProgramsSectionDashboard: React.FC = () => {
  const today = new Date();

  const calculateRemainingDays = (programDate: Date) => {
    const diffTime = programDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} দিন বাকি`;
    if (diffDays === 1) return "আগামীকাল";
    if (diffDays === 0) return "আজই অনুষ্ঠিত হবে";
    return "সম্পন্ন হয়েছে";
  };

  return (
    <section
      id="programs"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900"
    >
      <div className="container mx-auto px-0 bangla">
        <Heading
          title="প্রোগ্রাম"
          subTitle="আমাদের সাম্প্রতিক ইসলামিক প্রোগ্রামের তালিকা"
        />

        <div className="grid gap-6 md:grid-cols-4 mt-10">
          {MOCK_PROGRAMS.map((program, index) => {
            const programDate = new Date(program.date);
            const remainingDays = calculateRemainingDays(programDate);
            const isUpcoming = programDate >= today;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Islamic Decorative top icon */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-500 text-xl">🕌</span>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {program.programName}
                  </h3>
                </div>

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

                {/* Status at the bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`mt-auto w-full py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-semibold ${
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
