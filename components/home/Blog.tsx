"use client";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { useState } from "react";
import { OpenModal } from "../Modal";
import { ArticleItem, TArticlesSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";

interface ArticleProps {
  section: TArticlesSection | undefined;
}

export const ArticlesSection: React.FC<ArticleProps> = ({ section }) => {
  const MOCK_ARTICLES: ArticleItem[] = section?.data || [];
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  if (!section) {
    return <Spinner size="lg" />;
  }
  return (
    <Background id="blog">
      <Heading
        title={section?.heading?.title || " ব্লগ এবং নিবন্ধসমূহ"}
        subTitle={
          section?.heading?.subTitle ||
          " সাম্প্রতিক ইসলামিক শিক্ষণ ও দাওয়াতি প্রবন্ধসমূহ "
        }
      />

      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {MOCK_ARTICLES?.slice(0, 4)
          ?.reverse()
          ?.map((article: ArticleItem, index: number) => (
            <motion.div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer"
              onClick={() => setActiveArticle(article)}
            >
              <div className="mb-4">
                <h3 className="bangla lg:text-2xl text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2 transition-colors duration-500">
                  {article.blogtitle}
                </h3>
                <p className="bangla text-gray-600 dark:text-gray-300 text-sm">
                  <span className=" text-cyan-950 dark:text-amber-400 ">
                    Writer:
                  </span>
                  {article.blogwriter}
                </p>
                <p
                  className="bnagla line-clamp-3 text-gray-700 dark:text-gray-300 transition-colors duration-500"
                  dangerouslySetInnerHTML={{
                    __html:
                      article.blogdescription ||
                      "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
                  }}
                ></p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-500">
                {article.date}
              </p>
            </motion.div>
          ))}
      </div>

      {/* Modal */}
      {activeArticle && (
        <OpenModal
          title={activeArticle.blogtitle}
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          size="xl"
        >
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Writer: {activeArticle.blogwriter}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Date: {activeArticle.date}
            </p>
            <p
              className="text-gray-700 dark:text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html:
                  activeArticle?.blogdescription ||
                  "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
              }}
            ></p>
          </div>
        </OpenModal>
      )}
    </Background>
  );
};
