"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { ScrollShadow } from "@nextui-org/react";
import DashboardHeader from "./components/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full h-screen grid grid-cols-1 md:grid-cols-[20%_80%] lg:grid-cols-[15%_85%] transition-colors duration-500">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block h-full shadow-lg overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25 }}
            className="
              fixed inset-0 z-50 flex
              backdrop-blur-sm bg-black/20
            "
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25 }}
              className="
                w-52 h-full 
                bg-white dark:bg-slate-900 
                shadow-2xl rounded-r-2xl overflow-y-auto relative
              "
            >
              {/* Close Button */}
              <div className="p-2 flex justify-end items-center border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-10 h-10 flex items-center justify-center
                    rounded-full bg-white dark:bg-gray-800
                    shadow-md hover:shadow-lg
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-all duration-200
                  "
                  aria-label="Close Sidebar"
                >
                  <X size={22} className="text-gray-700 dark:text-white" />
                </button>
              </div>

              <Sidebar onLinkClick={() => setOpen(false)} />
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Open Sidebar"
        >
          <Menu size={20} className="text-gray-700 dark:text-white" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-col h-screen overflow-hidden rounded-tl-2xl shadow-inner bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <DashboardHeader />
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto mt-3 px-2 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </ScrollShadow>
      </main>
    </section>
  );
}
