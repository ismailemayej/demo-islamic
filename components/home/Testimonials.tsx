"use client";

import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import Loader from "../loader";
import { TestimonialItem, TTestimonialsSection } from "@/types/all-types";
import { Spinner } from "@heroui/spinner";

type TestimonialProps = {
  section: TTestimonialsSection | undefined;
};
export const TestimonialsSection: React.FC<TestimonialProps> = ({
  section,
}) => {
  const TESTIMONIALS = section?.data || [];
  if (!section) {
    return <Spinner size="lg" />;
  }

  return (
    <Background id="testimonials">
      <Heading
        title={section?.heading?.title || "জনপ্রিয় মতামত"}
        subTitle={
          section?.heading?.subTitle ||
          "আমাদের  Accademy:ের ছাত্র ও সম্প্রদায়ের সদস্যদের কাছ থেকে"
        }
      />

      <div className="mt-3 grid gap-8 md:grid-cols-4">
        {TESTIMONIALS?.slice(0, 4)
          ?.reverse()
          ?.map((testimonial: TestimonialItem, index: number) => (
            <motion.div
              key={testimonial.id}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="lg:w-16 lg:h-16 w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                )}
                <div>
                  <h3 className="bangla lg:text-xl text-md font-semibold text-emerald-700 dark:text-emerald-400">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 flex-1 line-clamp-5">
                {testimonial.comment}
              </p>
              <div className="mt-4 text-amber-500 text-2xl self-end">🕌</div>
            </motion.div>
          ))}
      </div>
    </Background>
  );
};
