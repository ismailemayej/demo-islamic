"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Image as HeroImage, Button, Skeleton } from "@heroui/react";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { Heading } from "../Heading";
import Background from "../background";
import { OpenModal } from "../Modal";
import Loader from "../loader";
import { TBookSection } from "@/types/all-types";

type BookSectionProps = {
  section: TBookSection | undefined;
};
export const BookSection: React.FC<BookSectionProps> = ({ section }) => {
  const { section: contactSection } = useGetSection("contactsection");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  if (!section) {
    return <Loader />;
  }
  const heading = section?.heading || {
    title: "Our Books",
    subTitle: "Explore our collection of Islamic and modern books",
  };
  const books = section?.data || [];
  const phone = contactSection?.data?.phone;

  return (
    <Background id="books">
      <Heading title={heading.title} subTitle={heading.subTitle} />
      {/* 🔹 Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-items-center">
        {books.length > 0 ? (
          books
            ?.slice(0, 6)
            ?.reverse()
            ?.map((book: any) => (
              <motion.div
                key={book._id || book.id}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center">
                  <div className="w-[200px] h-[250px] relative">
                    <img
                      src={book.bookimage}
                      alt={book.bookname}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
                      {book.bookname}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {book.writer}
                    </p>
                    {book.price && (
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mt-2">
                        ৳{book.price}
                      </p>
                    )}
                    <button
                      className="mt-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      onClick={() => setSelectedBook(book)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            কোনো বই পাওয়া যায়নি।
          </p>
        )}
      </div>

      {/* 🔹 Scrollable Modal */}
      {selectedBook && (
        <OpenModal
          title={selectedBook.bookname}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        >
          <div className="max-h-[70vh] overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-gray-200 dark:scrollbar-thumb-emerald-400 dark:scrollbar-track-gray-700">
            <HeroImage
              src={selectedBook.bookimage}
              alt={selectedBook.bookname}
              className="w-[220px] h-[220px] object-cover rounded-xl mx-auto mt-4"
            />
            <div className="space-y-4 pb-6 px-3">
              <p className="text-gray-700 dark:text-gray-200 font-medium bangla">
                ✍️ লেখক: {selectedBook.writer}
              </p>
              <p
                className="text-gray-600 dark:text-gray-300 text-justify bangla"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedBook.description ||
                    "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
                }}
              ></p>
              {phone && (
                <Button
                  as="a"
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  color="success"
                  variant="solid"
                  fullWidth
                >
                  WhatsApp এ যোগাযোগ করুন
                </Button>
              )}
            </div>
          </div>
        </OpenModal>
      )}
    </Background>
  );
};
