"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import { Award } from "lucide-react";
import Background from "../background";
import Loader from "../loader";
import { CertificateItem, TCertificateSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";

interface CertificateProps {
  section: TCertificateSection | undefined;
}

export const CertificateSection: React.FC<CertificateProps> = ({ section }) => {
  if (!section) {
    return <Spinner size="lg" />;
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
          ?.map((cert: CertificateItem, index: number) => (
            <motion.div
              key={index} // index fallback
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Degree */}
              {cert.degree && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">Degree:</span> {cert.degree}
                </p>
              )}

              {/* Institution */}
              {cert.institution && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold"> Accademy: </span>{" "}
                  {cert.institution}
                </p>
              )}

              {/* Board */}
              {cert.board && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">Board:</span> {cert.board}
                </p>
              )}

              {/* Year */}
              {cert.year && (
                <p className="text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-semibold">Year </span> {cert.year}
                </p>
              )}

              {/* GPA */}
              {cert.gpa && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">GPA/CGPA</span> {cert.gpa}
                </p>
              )}

              {/* Badge at bottom */}
              <motion.div className="absolute bottom-4 right-4 bg-amber-500 dark:bg-amber-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                <Award className="w-5 h-5" />
              </motion.div>
            </motion.div>
          ))}
      </div>
    </Background>
  );
};
