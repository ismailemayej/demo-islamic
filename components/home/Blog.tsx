"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { useState } from "react";

interface Article {
  id: string;
  blogtitle: string;
  blogdescription: string;
  blogwriter: string;
  date: string;
}

export const ArticlesSection: React.FC = () => {
  const { section } = useGetSection("blogsection");
  const MOCK_ARTICLES: Article[] = section?.data || [];

  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <Background id="blog">
      <div className="container mx-auto">
        <Heading
          title={section?.heading?.title || " ব্লগ এবং নিবন্ধসমূহ"}
          subTitle={
            section?.heading?.subTitle ||
            " সাম্প্রতিক ইসলামিক শিক্ষণ ও দাওয়াতি প্রবন্ধসমূহ "
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {MOCK_ARTICLES.map((article: Article, index: number) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer"
              onClick={() => setActiveArticle(article)}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 transition-colors duration-500">
                  {article.blogtitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Writer: {article.blogwriter}
                </p>
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500 truncate">
                  {article.blogdescription}
                </p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 transition-colors duration-500">
                {article.date}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/90 p-4">
          <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] p-6 sm:p-10">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-3 right-3 text-gray-800 dark:text-gray-200 text-2xl font-bold hover:text-red-500 transition"
            >
              &times;
            </button>

            {/* Article Content */}
            <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
              {activeArticle.blogtitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Writer: {activeArticle.blogwriter}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Date: {activeArticle.date}
            </p>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {activeArticle.blogdescription}
            </p>
          </div>
        </div>
      )}
    </Background>
  );
};
