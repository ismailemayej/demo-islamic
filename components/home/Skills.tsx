"use client";
import React from "react";
import { Heading } from "../Heading";
import { SkillItem, TSkillSection } from "@/types/all-types";
import Background from "../background";

const gradients = [
  "from-red-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-green-400 to-lime-500",
  "from-purple-400 to-violet-500",
  "from-pink-400 to-rose-500",
  "from-orange-400 to-yellow-500",
  "from-teal-400 to-cyan-500",
  "from-fuchsia-400 to-purple-500",
];
type SkillsSectionProps = {
  section?: TSkillSection | null | undefined;
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ section }) => {
  return (
    <Background id="skills">
      <Heading
        title={section?.heading?.title}
        subTitle={section?.heading?.subTitle}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {section?.data.map((skill: SkillItem, index) => {
          const color = gradients[index % gradients.length];
          return (
            <div
              key={index}
              className="bg-emerald-50 dark:bg-gray-800 dark:shadow-gray-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold dark:text-white text-gray-700">
                  {skill?.name}
                </span>
                <span className="text-sm font-medium dark:text-white text-gray-500">
                  {skill?.lavel}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
                  style={{ width: `${skill.lavel}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Background>
  );
};

export default SkillsSection;
