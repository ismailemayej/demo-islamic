"use client";

import { Menu, X } from "lucide-react";
import { MOCK_NAV_LINKS } from "@/data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "../theme-switch";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 
                 bg-white/70 dark:bg-gray-900/60 
                 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 
                 transition-all duration-500"
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="text-2xl sm:text-3xl font-[Quicksand] font-extrabold 
                     text-transparent bg-clip-text 
                     bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
                     dark:from-yellow-300 dark:via-amber-400 dark:to-yellow-400 
                     drop-shadow-sm"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
              scale: [1, 1.03, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 4,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% auto", display: "inline-block" }}
          >
            Dr.Mizanur Rahman
          </motion.span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {MOCK_NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[17px] font-semibold text-gray-700 dark:text-gray-300 bangla 
                         hover:text-amber-600 dark:hover:text-amber-400 
                         transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center justify-center">
            <span className="text-3xl text-amber-600 dark:text-amber-400 font-serif">
              ﷻ
            </span>
          </div>
          <ThemeSwitch />
          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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
              {MOCK_NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="bangla block px-5 py-3 text-lg font-medium 
                             text-gray-700 dark:text-gray-300 
                             hover:bg-amber-50/70 dark:hover:bg-gray-700/70 
                             hover:text-amber-600 dark:hover:text-amber-400 
                             rounded-lg mx-3 mb-2 transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
