"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { Button } from "@heroui/button";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mx-3 max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px] grid grid-cols-1 lg:grid-cols-[20%_80%] h-screen overflow-hidden">
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
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                Dashboard
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
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

      {/* Main Content */}
      <main className="">
        <div className="border-b-amber-300 flex justify-end w-full">
          <Button className="bg-green-500 px-2">Login</Button>{" "}
        </div>
        <div className="h-full mx-auto bg-white dark:bg-gray-900  rounded-2xl shadow-md px-6 sm:p-10">
          {children}
        </div>
      </main>
    </section>
  );
}
