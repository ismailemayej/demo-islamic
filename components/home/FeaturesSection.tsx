"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Globe, Badge } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Islamic Knowledge",
      description:
        "Extensive expertise in Quran, Hadith, and classical Islamic sciences.",
    },
    {
      icon: (
        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Teaching & Mentoring",
      description:
        "Guiding students and communities worldwide with practical wisdom.",
    },
    {
      icon: (
        <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: "Global Outreach",
      description:
        "Connecting Islamic teachings with modern society and global audiences.",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 overflow-hidden lg:px-4 transition-colors duration-500"
    >
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/20 dark:bg-emerald-500/20 rounded-full -z-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/10 dark:bg-emerald-900/20 rounded-full -z-10 blur-3xl"></div>

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <Badge className="bg-emerald-100 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-100 font-medium px-4 py-1 rounded-full inline-flex items-center gap-2 mb-4">
            Key Features
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-serif text-emerald-700 dark:text-emerald-300 mb-4">
            Scholar Highlights
          </h2>

          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Core strengths and focus areas that define the teachings and
            guidance of our esteemed Islamic scholar.
          </p>
        </motion.div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="shadow-lg dark:shadow-gray-700 rounded-2xl hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center gap-4">
                <div>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
