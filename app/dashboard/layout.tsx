"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { ScrollShadow } from "@nextui-org/react";
import { useGetSection } from "./Hook/GetData";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "@/components/theme-switch";
import { Alert } from "@heroui/alert";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { section } = useGetSection("websitesection");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setAlert({ type: "success", msg: "✅ Logout successful!" });
    router.push("/login");
  };

  return (
    <section className="lg:mx-auto grid grid-cols-1 lg:grid-cols-[20%_80%] h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 transition-colors duration-500">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block h-full border-r border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
        <Sidebar />
      </aside>
      {alert && (
        <Alert
          color={alert.type === "success" ? "success" : "danger"}
          variant="flat"
          className="mb-4 text-sm"
        >
          {alert.msg}
        </Alert>
      )}
      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 rounded-r-2xl"
          >
            <div className="p-1 flex justify-end items-center border rounded  border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X size={22} />
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
          className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg hover:scale-105 hover:shadow-2xl active:scale-95 transition-all duration-200"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex flex-col h-screen overflow-hidden rounded-tl-3xl shadow-inner bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="w-full bangla text-xl border-b border-gray-200 dark:border-gray-800 flex justify-end lg:justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md rounded-tl-3xl">
          <span className="lg:block hidden font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
            {section?.data?.sitetitle || "Dashboard"}
          </span>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-[0_5px_0px_0px_rgba(0,0,0,0.2)] 
                         hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] 
                         active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] 
                         active:translate-y-0.5 transition-all duration-300"
            >
              <span className="drop-shadow-sm">Logout</span>
            </motion.button>
          </div>
        </header>

        {/* Scrollable Section */}
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto py-8 px-2 bg-gray-50 dark:bg-gray-950"
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
