"use client";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import Loader from "../loader";

interface Achievement {
  id: string;
  title: string;
  count: number;
  icon: string;
}

export const AchievementsSection: React.FC = () => {
  const { section, loading, error } = useGetSection("achievementsection");
  if (loading) {
    return <Loader />;
  }
  // console.log("Achievement section:", section);
  const ACHIEVEMENTS = section?.data || [];

  return (
    <Background id="achievenents">
      <Heading
        title={section?.heading?.title || "সকল অর্জনসমূহ"}
        subTitle={section?.heading?.subTitle || " আমার উল্লেখযোগ্য অর্জনসমূহ "}
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {ACHIEVEMENTS?.slice(0, 4)
          ?.reverse()
          ?.map((achievement: Achievement, index: number) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{achievement.icon}</div>
              <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 transition-colors duration-500">
                {achievement.count}+
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-center transition-colors duration-500">
                {achievement.title}
              </p>
            </motion.div>
          ))}
      </div>
    </Background>
  );
};
