"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Understanding the Quran: Key Lessons",
    excerpt:
      "A deep dive into the core teachings of the Quran and how they shape our daily lives.",
    url: "#",
    date: "2025-10-15",
  },
  {
    id: "2",
    title: "Hadith Insights for Modern Life",
    excerpt:
      "Practical lessons from Hadith that guide ethical and spiritual living today.",
    url: "#",
    date: "2025-10-12",
  },
  {
    id: "3",
    title: "Islamic History: Lessons for the Present",
    excerpt:
      "Exploring pivotal moments in Islamic history and their relevance in contemporary society.",
    url: "#",
    date: "2025-10-10",
  },
  {
    id: "4",
    title: "Islamic History: Lessons for the Present",
    excerpt:
      "Exploring pivotal moments in Islamic history and their relevance in contemporary society.",
    url: "#",
    date: "2025-10-10",
  },
];

export const ArticlesSection: React.FC = () => {
  return (
    <section
      id="articles"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="container mx-auto">
        <Heading
          title=" ব্লগ এবং নিবন্ধসমূহ "
          subTitle=" সাম্প্রতিক ইসলামিক শিক্ষণ ও দাওয়াতি প্রবন্ধসমূহ "
        />

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {MOCK_ARTICLES.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 transition-colors duration-500">
                  {article.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
                  {article.excerpt}
                </p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 transition-colors duration-500">
                {article.date}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
