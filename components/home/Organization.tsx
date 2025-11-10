"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Heading } from "../Heading";
import { OpenModal } from "../Modal";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

export const OrganizationSection = () => {
  const { section, loading, error } = useGetSection("organizationsection");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  if (loading) return <p>Loading organizations...</p>;
  if (error || !section) return <p>Error loading organizations</p>;

  const organizations = section.data || [];

  return (
    <section className="relative py-20 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 dark:text-gray-200 transition-colors duration-700 bangla">
      <div className="container mx-auto text-center">
        <Heading
          title={section.heading?.title || "আমার প্রতিষ্ঠান সমূহ"}
          subTitle={
            section.heading?.subTitle ||
            "এই প্রতিষ্ঠানসমূহ দ্বীনের খেদমতে পরিচালনা করি"
          }
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {organizations.map((org: any, index: number) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <Card
                isHoverable
                className="shadow-lg bg-white/90 dark:bg-gray-800/60 border border-amber-100 dark:border-gray-700 rounded-2xl transition-all duration-300"
              >
                <img
                  src={org.img}
                  alt={org.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <CardBody className="text-center py-4">
                  {/* শুধু Name ক্লিকযোগ্য */}
                  <h3
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300"
                    onClick={() => setSelectedOrg(org)}
                  >
                    {org.name}
                  </h3>

                  <p className="text-amber-600 dark:text-amber-400 font-medium mb-2">
                    পজিশন: {org.possition}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mb-1">
                    ঠিকানা: {org.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                    {org.details}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scrollable Modal */}
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
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
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
    </section>
  );
};
