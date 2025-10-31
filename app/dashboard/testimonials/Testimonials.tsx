"use client";

import { Heading } from "@/components/Heading";
import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  image?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "মুহাম্মাদ হাসান",
    role: "Student",
    comment:
      "ড. ওমর আল-ফার্সির ওয়াজ এবং শিক্ষণ খুবই প্রেরণাদায়ক। আমি তার শিক্ষার মাধ্যমে অনেক কিছু শিখেছি।",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "আয়েশা বেগম",
    role: "Community Member",
    comment:
      "তার ইসলামিক প্রোগ্রামগুলো সত্যিই খুব সুন্দর ও উপকারী। প্রতিটি আলোচনা মনের প্রশান্তি দেয়।",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "মোহাম্মদ সায়েম",
    role: "Researcher",
    comment:
      "ড. আল-ফার্সির কাজের প্রতি তার নিষ্ঠা এবং জ্ঞান সত্যিই অনুপ্রেরণামূলক।",
    image: "https://randomuser.me/api/portraits/men/58.jpg",
  },
  {
    id: "4",
    name: "মোহাম্মদ সায়েম",
    role: "Researcher",
    comment:
      "ড. আল-ফার্সির কাজের প্রতি তার নিষ্ঠা এবং জ্ঞান সত্যিই অনুপ্রেরণামূলক।",
    image: "https://randomuser.me/api/portraits/men/58.jpg",
  },
];

export const TestimonialsSectionDashboard: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 bangla transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <Heading
          title="জনপ্রিয় মতামত"
          subTitle="আমাদের প্রতিষ্ঠানের ছাত্র ও সম্প্রদায়ের সদস্যদের কাছ থেকে"
        />

        <div className="mt-3 grid gap-8 md:grid-cols-4">
          {TESTIMONIALS.slice(0, 4).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-emerald-50 dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 flex-1">
                {testimonial.comment}
              </p>
              <div className="mt-4 text-amber-500 text-2xl self-end">🕌</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
