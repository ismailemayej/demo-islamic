"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { MessageCircle, PhoneCall } from "lucide-react";
import { Heading } from "@/components/Heading";

const teamMembers = [
  {
    id: 1,
    name: "মোঃ ইসমাইল হোসেন",
    role: "প্রতিষ্ঠাতা ও ডেভেলপার",
    img: "https://img.freepik.com/free-photo/portrait-handsome-man_273609-23090.jpg",

    whatsapp: "https://wa.me/8801858226967",
    imo: "https://imo.im/",
  },
  {
    id: 2,
    name: "আবদুল্লাহ আল মামুন",
    role: "UI/UX ডিজাইনার",
    img: "https://img.freepik.com/free-photo/creative-young-woman-working_23-2148423615.jpg",

    whatsapp: "#",
    imo: "#",
  },
  {
    id: 3,
    name: "ড. মিজানুর রহমান",
    role: "ইসলামিক পরামর্শক",
    img: "https://img.freepik.com/free-photo/portrait-middle-aged-man_23-2148886214.jpg",

    whatsapp: "#",
    imo: "#",
  },
  {
    id: 4,
    name: "রফিকুল ইসলাম",
    role: "ব্যাকএন্ড ডেভেলপার",
    img: "https://img.freepik.com/free-photo/smiling-young-man_23-2148886215.jpg",

    whatsapp: "#",
    imo: "#",
  },
  {
    id: 5,
    name: "মাহমুদুল হাসান",
    role: "ফ্রন্টএন্ড ডেভেলপার",
    img: "https://img.freepik.com/free-photo/happy-young-businessman_23-2148886216.jpg",
    desc: "রেসপন্সিভ এবং ডাইনামিক ইন্টারফেস তৈরি করেন।",
    whatsapp: "#",
    imo: "#",
  },
];

export const TeamSectionDashboard = () => {
  return (
    <section
      id="team"
      className="relative py-20 px-3 rounded-xl 
                 bg-gradient-to-b from-amber-50 to-white 
                 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 
                 dark:text-gray-200 transition-colors duration-700 bangla"
    >
      <div className="w-full text-center sm:px-6 lg:px-8">
        <Heading
          title="আমার টিম সদস্যগণ"
          subTitle="যারা এই প্ল্যাটফর্মটিকে সফল করতে কাজ করে যাচ্ছেন"
        />

        {/* Team Grid */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full mt-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="w-full"
            >
              <Card
                isHoverable
                isPressable
                className="flex flex-col items-center shadow-xl 
                     bg-white/80 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 
                     backdrop-blur-lg rounded-2xl transition-all duration-300 w-full"
              >
                <CardHeader className="flex flex-col items-center gap-2 w-full">
                  <Avatar
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 ring-4 ring-amber-400 dark:ring-amber-500 shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    {member.role}
                  </p>
                </CardHeader>

                <CardFooter className="flex justify-center gap-4 mt-2">
                  {member.whatsapp && (
                    <Tooltip content="WhatsApp">
                      <Button
                        isIconOnly
                        as="a"
                        href={member.whatsapp}
                        target="_blank"
                        variant="light"
                      >
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 hover:scale-110 transition-transform duration-200" />
                      </Button>
                    </Tooltip>
                  )}
                  {member.imo && (
                    <Tooltip content="Imo">
                      <Button
                        isIconOnly
                        as="a"
                        href={member.imo}
                        target="_blank"
                        variant="light"
                      >
                        <PhoneCall className="w-5 h-5 text-sky-500 dark:text-sky-400 hover:scale-110 transition-transform duration-200" />
                      </Button>
                    </Tooltip>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
