"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardFooter,
  Image as HeroImage,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
} from "@heroui/react";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
import { Heading } from "../Heading";
import Background from "../background";

export const BookSection = () => {
  const { section, loading } = useGetSection("booksection");
  const { section: mobilenumber } = useGetSection("contactsection");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 rounded-2xl shadow-md">
            <Skeleton className="h-72 w-full rounded-lg" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const heading = section?.heading || {
    title: "Our Books",
    subTitle: "Explore our collection of Islamic and modern books",
  };
  const books = section?.data;

  return (
    <Background id="books">
      <Heading title={heading.title} subTitle={heading.subTitle} />

      {/* Books */}
      <div className="px-4 mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
        {books.map((book: any) => (
          <motion.div key={book.id} whileHover={{ scale: 1.03 }}>
            <Card
              isPressable
              onPress={() => setSelectedBook(book)}
              className="shadow-lg rounded-2xl border border-emerald-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
            >
              <CardBody className="p-0">
                <img
                  src={book.bookimage}
                  alt={book.bookname}
                  className="object-cover w-[200px] h-[250px] sm:h-[250px] object-top"
                />
              </CardBody>
              <CardFooter className="flex flex-col items-center text-center py-3">
                <h3
                  onClick={() => setSelectedBook(book)}
                  className="text-base sm:text-lg font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer bangla"
                >
                  {book.bookname}
                </h3>
                <p className="bangla text-sm text-gray-500 dark:text-gray-400">
                  {book.writer}
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        size="md"
        isOpen={!!selectedBook}
        onOpenChange={() => setSelectedBook(null)}
      >
        <ModalContent>
          {(onClose) =>
            selectedBook && (
              <>
                <ModalHeader className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 bangla">
                  {selectedBook.bookname}
                </ModalHeader>
                <ModalBody className="space-y-4 pb-6">
                  <HeroImage
                    src={selectedBook.bookimage}
                    alt={selectedBook.bookname}
                    className="w-[220px] h-[220px] object-cover rounded-xl"
                  />
                  <p className="text-gray-700 dark:text-gray-200 font-medium bangla">
                    ✍️ লেখক: {selectedBook.writer}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-justify bangla">
                    {selectedBook.description}
                  </p>
                  <Button
                    as="a"
                    href={`https://wa.me/${mobilenumber?.data?.phone}`}
                    target="_blank"
                    color="success"
                    variant="solid"
                    fullWidth
                    onPress={onClose}
                  >
                    WhatsApp এ যোগাযোগ করুন
                  </Button>
                </ModalBody>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </Background>
  );
};
