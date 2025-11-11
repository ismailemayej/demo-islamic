"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { ScrollShadow } from "@nextui-org/react";
import { useGetSection } from "./Hook/GetData";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { ThemeSwitch } from "@/components/theme-switch";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { section } = useGetSection("websitesection");
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Remove cookie properly
    document.cookie =
      "loggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

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
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 p-1"
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
          className="p-2 bg-white dark:bg-gray-800 shadow-md hover:scale-105 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Header */}
        <header className="w-full bangla text-xl border-b border-gray-200 dark:border-gray-800 flex justify-end lg:justify-between items-center p-4 bg-white dark:bg-gray-900">
          <span className=" lg:block hidden font-semibold text-gray-700 dark:text-gray-200">
            {section?.data?.sitetitle || "Dashboard"}
          </span>
          <span className="flex gap-2">
            <ThemeSwitch />
            <Button
              color="primary"
              onClick={handleLogout}
              className="hover:font-extrabold hover:text-red-500 dark:hover:text-red-400 transition"
            >
              Logout
            </Button>
          </span>
        </header>

        {/* Scrollable Section */}
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto py-6 bg-gray-50 dark:bg-gray-950"
        >
          {children}
        </ScrollShadow>
      </main>
    </section>
  );
}
