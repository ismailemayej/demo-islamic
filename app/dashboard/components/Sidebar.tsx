"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarProfile } from "./DashboardProfile";
import { ScrollShadow } from "@nextui-org/react";
import { DraggableList } from "../Hook/DraggableList";

import {
  FaHome,
  FaUserAlt,
  FaAward,
  FaBlogger,
  FaCalendarAlt,
  FaStar,
  FaEnvelope,
  FaBook,
  FaImages,
  FaThLarge,
  FaUsers,
  FaSmileBeam,
  FaTv,
  FaBookReader,
  FaMedal,
  FaServicestack,
} from "react-icons/fa";

interface SidebarLink {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

export const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  const [links, setLinks] = useState<SidebarLink[]>([
    {
      id: "1",
      name: "Dashboard",
      icon: <FaHome className="text-blue-500 text-lg" />,
      href: "/dashboard",
    },
    {
      id: "2",
      name: "Hero Section",
      icon: <FaBookReader className="text-rose-500 text-lg" />,
      href: "/dashboard/herosection",
    },
    {
      id: "3",
      name: "About Section",
      icon: <FaUserAlt className="text-green-500 text-lg" />,
      href: "/dashboard/about",
    },
    {
      id: "4",
      name: "Achievements",
      icon: <FaMedal className="text-yellow-500 text-lg" />,
      href: "/dashboard/achievements",
    },
    {
      id: "5",
      name: "Blog",
      icon: <FaBlogger className="text-orange-500 text-lg" />,
      href: "/dashboard/blog",
    },
    {
      id: "7",
      name: "Certificate",
      icon: <FaAward className="text-teal-500 text-lg" />,
      href: "/dashboard/certificate",
    },
    {
      id: "8",
      name: "Contact",
      icon: <FaEnvelope className="text-pink-500 text-lg" />,
      href: "/dashboard/contact",
    },
    {
      id: "9",
      name: "Education",
      icon: <FaBook className="text-indigo-500 text-lg" />,
      href: "/dashboard/education",
    },
    {
      id: "10",
      name: "Gallery",
      icon: <FaImages className="text-cyan-500 text-lg" />,
      href: "/dashboard/gallery",
    },
    {
      id: "11",
      name: "Programs",
      icon: <FaThLarge className="text-lime-500 text-lg" />,
      href: "/dashboard/programs",
    },
    {
      id: "12",
      name: "Organization",
      icon: <FaUsers className="text-blue-400 text-lg" />,
      href: "/dashboard/organization",
    },
    {
      id: "13",
      name: "Social Media",
      icon: <FaSmileBeam className="text-yellow-400 text-lg" />,
      href: "/dashboard/socialmedia",
    },
    {
      id: "14",
      name: "Teams",
      icon: <FaUsers className="text-emerald-500 text-lg" />,
      href: "/dashboard/teams",
    },
    {
      id: "18",
      name: "Services",
      icon: <FaServicestack className="text-emerald-500 text-lg" />,
      href: "/dashboard/services",
    },
    {
      id: "15",
      name: "Testimonials",
      icon: <FaStar className="text-amber-400 text-lg" />,
      href: "/dashboard/testimonials",
    },
    {
      id: "16",
      name: "Youtube Videos",
      icon: <FaTv className="text-red-500 text-lg" />,
      href: "/dashboard/youtube",
    },
    {
      id: "17",
      name: "Books",
      icon: <FaBookReader className="text-green-400 text-lg" />,
      href: "/dashboard/books",
    },
    {
      id: "6",
      name: "Booking",
      icon: <FaCalendarAlt className="text-purple-500 text-lg" />,
      href: "/dashboard/booking",
    },
  ]);

  return (
    <aside
      className="flex flex-col mt-2 lg:pl-3 h-screen w-52 bg-gradient-to-br
        from-amber-50 to-white
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl lg:mx-2"
    >
      <SidebarProfile />

      <ScrollShadow
        hideScrollBar
        className="flex-1 overflow-y-scroll lg:mb-0 mb-20 ml-2"
      >
        <DraggableList<SidebarLink>
          items={links}
          getId={(item: SidebarLink) => item.id}
          onChange={setLinks}
          renderItem={(link: SidebarLink) => (
            <>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 
                ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 text-green-600 scale-105"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </>
          )}
        />
      </ScrollShadow>
    </aside>
  );
};
