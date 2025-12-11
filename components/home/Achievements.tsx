"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { AchievementItem, TAchievementsSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";

interface AchievementProps {
  section: TAchievementsSection | undefined;
}

export const AchievementsSection: React.FC<AchievementProps> = ({
  section,
}) => {
  if (!section) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const ACHIEVEMENTS = section?.data || [];

  return (
    <Background id="achievements">
      {/* Section Heading */}
      <Heading
        title={section?.heading?.title || "সকল অর্জনসমূহ"}
        subTitle={section?.heading?.subTitle || "আমার উল্লেখযোগ্য অর্জনসমূহ"}
      />

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <AnimatePresence>
          {ACHIEVEMENTS.slice(0, 4)
            .reverse()
            .map((achievement: AchievementItem) => (
              <motion.div
                key={achievement.id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl "
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  {achievement.count}+
                </h3>
                <p className="line-clamp-2 text-gray-700 dark:text-gray-300 text-center ">
                  {achievement.title}
                </p>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </Background>
  );
};
