"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@nextui-org/react";
import { useGetSection } from "./Hook/GetData";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { section } = useGetSection("websitesection");
  const [open, setOpen] = useState(false);

  return (
    <section className="lg:mx-3 max-w-[1536px] grid grid-cols-1 lg:grid-cols-[20%_80%] h-screen">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar onLinkClick={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md hover:scale-105 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Header */}
        <div className="bangla text-xl border-b border-gray-200 dark:border-gray-800 flex justify-between w-full p-4 bg-white dark:bg-gray-900 ml-3">
          <span></span>
          {section?.data?.sitetitle}
          <button className="hover:font-extrabold dark:hover:green-500 transition hover:text-blue-500 mx-4">
            Login
          </button>
        </div>
        {/* Scrollable Section */}
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto lg:px-10 py-6 bg-white dark:bg-gray-900 rounded-t-2xl shadow-inner"
        >
          {children}
        </ScrollShadow>
      </main>
    </section>
  );
}
