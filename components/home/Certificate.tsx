"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import { Award } from "lucide-react";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";
import Loader from "../loader";

interface Certificate {
  degree?: string;
  institution?: string;
  board?: string;
  year?: string;
  gpa?: string;
}

export const CertificateSection: React.FC = () => {
  const { section, loading, error } = useGetSection("certificatesection");
  if (loading) {
    return <Loader />;
  }
  const CERTIFICATES = section?.data || [];

  return (
    <Background id="certificates">
      <Heading
        title={section?.heading?.title || "সার্টিফিকেট "}
        subTitle={
          section?.heading?.subTitle || "আমার অর্জিত সার্টিফিকেট ও কোর্সসমূহ"
        }
      />

      <div className="grid gap-6 md:grid-cols-3 mt-10">
        {CERTIFICATES?.slice(0, 6)
          ?.reverse()
          ?.map((cert: Certificate, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-700 hover:shadow-2xl dark:hover:shadow-gray-600 transition-all duration-300 p-6 relative overflow-hidden"
            >
              {/* Degree */}
              {cert.degree && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">ডিগ্রীঃ</span> {cert.degree}
                </p>
              )}

              {/* Institution */}
              {cert.institution && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">প্রতিষ্ঠানঃ</span>{" "}
                  {cert.institution}
                </p>
              )}

              {/* Board */}
              {cert.board && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">বোর্ডঃ</span> {cert.board}
                </p>
              )}

              {/* Year */}
              {cert.year && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">সালঃ</span> {cert.year}
                </p>
              )}

              {/* GPA */}
              {cert.gpa && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">GPA / CGPAঃ</span> {cert.gpa}
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
    </Background>
  );
};
