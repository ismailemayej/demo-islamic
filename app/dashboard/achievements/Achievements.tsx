"use client";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";
interface Achievement {
  id: string;
  title: string;
  count: number;
  icon: string; // Emoji or icon
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "1", title: "Published Books", count: 12, icon: "📚" },
  { id: "2", title: "Islamic Seminars", count: 45, icon: "🕌" },
  { id: "3", title: "Students Trained", count: 350, icon: "👨‍🎓" },
  { id: "4", title: "Online Videos", count: 120, icon: "🎥" },
];

export const AchievementsDashboard: React.FC = () => {
  return (
    <Background id="achievenents">
      <div className="container mx-auto">
        <Heading
          title=" সকল অর্জনসমূহ "
          subTitle=" আমার উল্লেখযোগ্য অর্জনসমূহ "
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {ACHIEVEMENTS.map((achievement, index) => (
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
      </div>
    </Background>
  );
};
