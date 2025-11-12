"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitch } from "../theme-switch";
import { Container } from "../container";
import Link from "next/link";
import {
  Home,
  User,
  Video,
  Image,
  Calendar,
  Share2,
  Phone,
  Building,
  Book,
  Star,
  BookOpen,
  Trophy,
  FileText,
  Users,
  CalendarCheck,
} from "lucide-react";
import { NavLink } from "@/data";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const MOCK_NAV_LINKS: NavLink[] = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "About", href: "#about", icon: <User className="w-5 h-5" /> },
    {
      name: "Videos",
      href: "#youtubevideos",
      icon: <Video className="w-5 h-5" />,
    },
    { name: "Gallary", href: "#gallery", icon: <Image className="w-5 h-5" /> },
    {
      name: "Proggams",
      href: "#programs",
      icon: <Calendar className="w-5 h-5" />,
    },
    { name: "Social", href: "#social", icon: <Share2 className="w-5 h-5" /> },
    { name: "Contact", href: "#contact", icon: <Phone className="w-5 h-5" /> },
    {
      name: "Organizations",
      href: "#organizations",
      icon: <Building className="w-5 h-5" />,
    },
    { name: "Books", href: "#books", icon: <Book className="w-5 h-5" /> },
    {
      name: "Testimonials",
      href: "#testimonials",
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: "Education",
      href: "#education",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Achivments",
      href: "#achievenents",
      icon: <Trophy className="w-5 h-5" />,
    },
    { name: "Blogs", href: "#blog", icon: <FileText className="w-5 h-5" /> },
    {
      name: "Certificate",
      href: "#certificates",
      icon: <Trophy className="w-5 h-5" />,
    },
    { name: "Team", href: "#teams", icon: <Users className="w-5 h-5" /> },
    {
      name: "Appoinment",
      href: "#booking",
      icon: <CalendarCheck className="w-5 h-5" />,
    },
  ];

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 
                 bg-white/70 dark:bg-gray-900/60 
                 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 
                 transition-all duration-500"
    >
      <Container>
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* 🔹 Logo */}
          <motion.div
            className="lg:text-2xl text-xl font-[Quicksand] font-extrabold 
                     text-transparent bg-clip-text 
                     bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
                     dark:from-yellow-300 dark:via-amber-400 dark:to-yellow-400 
                     drop-shadow-sm"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Link href="/">
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
            </Link>
          </motion.div>

          {/* 🔹 Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {MOCK_NAV_LINKS.slice(0, 7).map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative text-[17px] font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-1"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Icon with floating effect */}
                {link.icon && (
                  <motion.span
                    className="flex items-center"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {link.icon}
                  </motion.span>
                )}

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
            <div className="hidden lg:flex items-center justify-center">
              <span className="text-3xl text-amber-600 dark:text-amber-400 font-serif">
                ﷻ
              </span>
            </div>
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
              {MOCK_NAV_LINKS.slice(0, 7).map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 5 }}
                  className="block px-5 py-3 text-lg font-bold 
                             text-gray-700 dark:text-gray-300 
                             hover:bg-amber-50/70 dark:hover:bg-gray-700/70 
                             hover:text-amber-600 dark:hover:text-amber-400 
                             rounded-lg mx-3 mb-2 transition-all duration-200"
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
