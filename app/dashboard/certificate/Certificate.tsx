"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";

import { Award } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  institution: string;
  date: string;
  description?: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "1",
    title: "Complete Web Development Course",
    institution: "Programming Hero",
    date: "2023",
    description: "MERN Stack Development with modern technologies",
  },
  {
    id: "2",
    title: "Next Level Web Development",
    institution: "Programming Hero",
    date: "2024",
    description: "Advanced Next.js, TypeScript & Full-stack Projects",
  },
  {
    id: "3",
    title: "Typing Speed Enhancement",
    institution: "Typing.com",
    date: "2022",
    description: "Achieved 70+ WPM typing proficiency",
  },
];

export const CertificateSectionDashboard: React.FC = () => {
  return (
    <section
      id="certificates"
      className="bangla py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto bangla">
        <Heading
          title="সার্টিফিকেট "
          subTitle="আমার অর্জিত সার্টিফিকেট ও কোর্সসমূহ"
        />

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-700 hover:shadow-2xl dark:hover:shadow-gray-600 transition-all duration-300 p-6 relative overflow-hidden"
            >
              {/* Top Decorative Icon */}
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-amber-600 dark:text-amber-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {cert.title}
                </h3>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">প্রতিষ্ঠানঃ</span>{" "}
                {cert.institution}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">সালঃ</span> {cert.date}
              </p>
              {cert.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {cert.description}
                </p>
              )}

              {/* Badge at bottom */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 right-4 bg-amber-500 dark:bg-amber-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              >
                <Award className="w-5 h-5" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
