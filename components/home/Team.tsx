"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { MessageCircle, PhoneCall } from "lucide-react";
import { Heading } from "../Heading";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Background from "../background";

export const TeamSection = () => {
  const { section, loading, error } = useGetSection("teamsection");
  const { section: mobilenumber } = useGetSection("contactsection");

  if (loading) return <p>Loading team members...</p>;
  if (error || !section) return <p>Error loading team members</p>;

  const teamMembers = section.data || [];

  return (
    <Background id="teams">
      <div className="w-full text-center sm:px-6 lg:px-8">
        <Heading
          title={section.heading?.title || "আমার টিম সদস্যগণ"}
          subTitle={
            section.heading?.subTitle ||
            "যারা এই প্ল্যাটফর্মটিকে সফল করতে কাজ করে যাচ্ছেন"
          }
        />

        {/* Team Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full mt-8">
          {teamMembers.map((member: any, index: number) => (
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
                    src={member.imageurl}
                    alt={member.name}
                    className="w-24 h-24 ring-4 ring-amber-400 dark:ring-amber-500 shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                    {member.position}
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
                  {member && (
                    <Tooltip content="Mobile">
                      <Button
                        isIconOnly
                        as="a"
                        href={`tel:${mobilenumber?.data?.phone}`}
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
    </Background>
  );
};
