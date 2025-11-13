"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton"; // ✅ HeroUI Skeleton import
import { Heading } from "../Heading";
import { OpenModal } from "../Modal";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";

export const OrganizationSection = () => {
  const { section, loading, error } = useGetSection("organizationsection");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  const organizations = section?.data || [];

  if (error || !section)
    return <p className="text-center py-10">Error loading organizations</p>;

  return (
    <Background id="organizations">
      <div className="mx-auto px-3 lg:px-8 py-12">
        <Heading
          title={section?.heading?.title || "আমার প্রতিষ্ঠান সমূহ"}
          subTitle={
            section?.heading?.subTitle ||
            "এই প্রতিষ্ঠানসমূহ দ্বীনের খেদমতে পরিচালনা করি"
          }
        />

        {/* ✅ লোডিং চলাকালীন Skeleton দেখাও */}
        {!loading && (
          <div className="grid gap-6 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org: any, index: number) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: -5,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                style={{ perspective: 1000 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="w-full cursor-pointer"
              >
                <Card
                  isHoverable
                  className="flex flex-col items-center shadow-xl bg-white/80 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 backdrop-blur-lg rounded-2xl transition-all duration-300"
                >
                  {org.img && (
                    <img
                      src={org.img}
                      alt={org.name}
                      className="w-full h-40 object-cover rounded-t-2xl"
                      onClick={() => setSelectedOrg(org)}
                    />
                  )}
                  <CardBody className="text-center py-4">
                    <h4
                      className="bangla text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 cursor-pointer"
                      onClick={() => setSelectedOrg(org)}
                    >
                      {org.name}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      পজিশন: {org.possition}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      ঠিকানা: {org.address}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ✅ Scrollable Modal */}
        {selectedOrg && (
          <OpenModal
            title={selectedOrg.name}
            isOpen={!!selectedOrg}
            onClose={() => setSelectedOrg(null)}
            size="xl"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <img
                src={selectedOrg.img}
                alt={selectedOrg.name}
                className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {selectedOrg.name}
              </h2>
              <p className="text-amber-600 dark:text-amber-400 font-medium text-lg mb-1">
                পজিশন: {selectedOrg.possition}
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                <strong>ঠিকানা:</strong> {selectedOrg.address}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-justify whitespace-pre-line">
                {selectedOrg.details}
              </p>
            </div>
          </OpenModal>
        )}
      </div>
    </Background>
  );
};
