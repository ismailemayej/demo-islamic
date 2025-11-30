"use client";

import React, { useState } from "react";
import { useGetSection } from "../Hook/GetData";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // <<=== added

const DashboardHeader = () => {
  const router = useRouter(); // <<=== router initialize
  const { section } = useGetSection("websitesection");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setAlert({ type: "success", msg: "Logout successful!" });

    // Redirect after logout
    router.push("/login"); // <<=== redirect here
  };

  return (
    <header
      className="
        w-full 
        px-4 sm:px-6 py-4  
        flex items-center lg:justify-between justify-end bg-gradient-to-br
        from-amber-50 to-white dark:bg-slate-800/40 
        backdrop-blur-xl shadow-lg  
        border border-white/30 dark:border-slate-700/30  
        rounded-t-2xl mt-2 mx-2
        
      "
    >
      <h1
        className="
          hidden sm:block
          text-lg sm:text-xl font-semibold 
          text-gray-700 dark:text-gray-200 tracking-wide
        "
      >
        {section?.data?.sitetitle || "Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        <ThemeSwitch />

        <Button
          size="md"
          onClick={handleLogout}
          className="
            rounded-xl shadow-sm 
            bg-gradient-to-r from-blue-600 to-blue-500 
            text-white hover:opacity-90
            flex items-center gap-1
          "
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
