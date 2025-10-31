"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Heading } from "@/components/Heading";
import { OpenModal } from "@/components/Modal";

const organizations = [
  {
    id: 1,
    name: "বাংলাদেশ সফটওয়্যার লিমিটেড",
    possition: "পতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালক",
    address: "ঢাকা, বাংলাদেশ",
    img: "https://img.freepik.com/free-photo/modern-office-building_23-2148886200.jpg",
    details:
      "দেশের আইটি সেবা প্রদানের অন্যতম প্রতিষ্ঠান। প্রতিষ্ঠানের বিভিন্ন বিভাগ রয়েছে, যেমন ডেভেলপমেন্ট, সার্ভিস সাপোর্ট, ক্লায়েন্ট রিলেশন।",
  },
  {
    id: 2,
    name: "চট্টগ্রাম স্টার্টআপ এক্সচেঞ্জ",
    possition: "সহ-প্রতিষ্ঠাতা ও সিইও",
    address: "চট্টগ্রাম, বাংলাদেশ",
    img: "https://img.freepik.com/free-photo/business-office-building_23-2148886201.jpg",
    details:
      "চট্টগ্রামের স্টার্টআপ ইকোসিস্টেমকে সমর্থন ও উন্নত করার লক্ষ্যে কাজ করে। উদ্যোক্তাদের জন্য বিভিন্ন প্রোগ্রাম ও ইভেন্ট আয়োজন করে।",
  },
  {
    id: 3,
    name: "হাঁসা ফাযিল মাদ্রাসা",
    possition: " প্রিন্সিপাল কনসালটেন্ট",
    address: "চট্টগ্রাম, বাংলাদেশ",
    img: "https://img.freepik.com/free-photo/business-office-building_23-2148886201.jpg",
    details:
      "একটি আধুনিক ইসলামিক শিক্ষা প্রতিষ্ঠান যা শিক্ষার্থীদের জন্য উচ্চমানের শিক্ষা ও নৈতিক মূল্যবোধ গড়ে তোলে।",
  },
];

export const OrganizationSectionDashboard = () => {
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  return (
    <section className="relative py-20 px-3 rounded-xl bg-gradient-to-b from-amber-50 to-white dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 dark:text-gray-200 transition-colors duration-700 bangla">
      <div className="container mx-auto text-center">
        <Heading
          title="আমার প্রতিষ্ঠান সমূহ"
          subTitle="এই প্রতিষ্ঠানসমূহ দ্বীনের খেদমতে পরিচালনা করি"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mt-8">
          {organizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="w-full cursor-pointer"
            >
              <Card
                isHoverable
                className="flex flex-col items-center shadow-xl bg-white/80 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 backdrop-blur-lg rounded-2xl transition-all duration-300"
              >
                <img
                  src={org.img}
                  alt={org.name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
                <CardBody className="text-center py-4">
                  <h4
                    className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 cursor-pointer"
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

        {/* Modal */}
        {selectedOrg && (
          <OpenModal
            title={selectedOrg.name}
            isOpen={!!selectedOrg}
            onClose={() => setSelectedOrg(null)}
            size="lg"
          >
            <img
              src={selectedOrg.img}
              alt={selectedOrg.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 dark:text-gray-200">
              <strong>পরিচালক:</strong> {selectedOrg.director}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-1">
              <strong>ঠিকানা:</strong> {selectedOrg.address}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mt-2">
              {selectedOrg.details}
            </p>
          </OpenModal>
        )}
      </div>
    </section>
  );
};
