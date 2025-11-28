"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "../theme-switch";
import { Container } from "../container";
import Link from "next/link";
import { useGetSection } from "@/app/dashboard/Hook/GetData";

import Loader from "../loader";
export type NavLink = {
  name: string;
  url: string;
  id: number;
  // children?: NavLink[];
};

export const Navbar: React.FC = () => {
  const { section, loading } = useGetSection("websitesection");
  const [isOpen, setIsOpen] = useState(false);
  const NAV_LINKS: NavLink[] = section?.data?.NavLinks;
  if (loading) return <Loader />;

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50
                 bg-white/70 dark:bg-gray-900/60
                 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700
                 transition-all duration-500 lg:px-0 px-2"
    >
      <Container>
        <nav className="container mx-auto py-3 flex justify-between items-center">
          {/* 🔹 Logo */}
          <motion.div
            className="lg:text-4xl text-xl font-[Quicksand] font-extrabold
             text-transparent bg-clip-text
             bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-500
             dark:from-green-300 dark:via-emerald-400 dark:to-cyan-400
             drop-shadow-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Link href="/">
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r 
                 from-green-400 via-emerald-500 to-cyan-500
                 dark:from-green-300 dark:via-emerald-400 dark:to-cyan-400"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 5,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto", display: "inline-block" }}
              >
                {section?.data?.sitetitle}
              </motion.span>
            </Link>
          </motion.div>

          {/* 🔹 Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link: NavLink) => (
              <motion.a
                key={link.name}
                href={link.url}
                className="relative text-[17px] font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-1"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Text with underline hover */}
                <span className="relative group cursor-pointer">
                  <span className="transition-all duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {link.name}
                  </span>
                  <span
                    className="absolute left-0 bottom-0 w-0 h-[2px]
                    bg-gradient-to-r from-amber-400 to-yellow-500
                    dark:from-amber-400 dark:to-yellow-500
                    rounded-full transition-all duration-500 group-hover:w-full"
                  ></span>
                </span>
              </motion.a>
            ))}
          </div>

          {/* 🔹 Right Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center justify-center"></div>
            <ThemeSwitch />

            {/* 🔹 Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              ) : (
                <Menu className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </button>
          </div>
        </nav>
      </Container>
      {/* 🔹 Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute w-full
                       bg-white/90 dark:bg-gray-800/90
                       backdrop-blur-md border-t border-gray-200 dark:border-gray-700
                       shadow-md transition-all duration-500"
          >
            <div className="flex flex-col py-4">
              {NAV_LINKS.map((link: NavLink) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 5 }}
                  className="block px-5 py-1 text-lg font-bold
                             text-gray-700 dark:text-gray-300
                             hover:bg-amber-50/70 dark:hover:bg-gray-700/70
                             hover:text-amber-600 dark:hover:text-amber-400
                             rounded-lg mx-3 transition-all duration-200"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
