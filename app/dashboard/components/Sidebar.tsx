"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ScrollShadow } from "@nextui-org/react";
import {
  Home,
  Users,
  FileText,
  User,
  BookOpen,
  Calendar,
  Image,
  Mail,
  Award,
  Star,
  Book,
  Grid,
  Tv,
  Smile,
} from "lucide-react";
import { SidebarProfile } from "./DashboardProfile";

export const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();

  const links = [
    {
      name: "HeroSection",
      icon: <BookOpen size={18} />,
      href: "/dashboard/herosection",
    },
    {
      name: "AboutSection",
      icon: <User size={18} />,
      href: "/dashboard/about",
    },
    {
      name: "Achievements",
      icon: <Award size={18} />,
      href: "/dashboard/achievements",
    },
    { name: "Blog", icon: <FileText size={18} />, href: "/dashboard/blog" },
    {
      name: "Booking",
      icon: <Calendar size={18} />,
      href: "/dashboard/booking",
    },
    {
      name: "Certificate",
      icon: <Star size={18} />,
      href: "/dashboard/certificate",
    },
    { name: "Contact", icon: <Mail size={18} />, href: "/dashboard/contact" },
    {
      name: "Education",
      icon: <Book size={18} />,
      href: "/dashboard/education",
    },
    { name: "Gallery", icon: <Image size={18} />, href: "/dashboard/gallery" },
    { name: "Programs", icon: <Grid size={18} />, href: "/dashboard/programs" },
    {
      name: "Organization",
      icon: <Users size={18} />,
      href: "/dashboard/organization",
    },
    {
      name: "SocialMedia",
      icon: <Smile size={18} />,
      href: "/dashboard/socialmedia",
    },
    { name: "Teams", icon: <Users size={18} />, href: "/dashboard/teams" },
    {
      name: "Testimonials",
      icon: <Star size={18} />,
      href: "/dashboard/testimonials",
    },
    {
      name: "YoutubeVideos",
      icon: <Tv size={18} />,
      href: "/dashboard/youtube",
    },
  ];

  return (
    <aside className="flex flex-col h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Top Section */}
      <SidebarProfile />

      {/* Scrollable Menu */}
      <ScrollShadow
        hideScrollBar
        className="flex-1 overflow-y-auto px-2 scrollbar-thin 
                   scrollbar-thumb-gray-400 scrollbar-track-gray-100 
                   dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <ul className="space-y-2 pt-3 pb-5">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
                  ${
                    pathname === link.href
                      ? "bg-indigo-100 dark:bg-gray-800 text-green-500"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollShadow>

      {/* Fixed Logout Button */}
      {/* <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-red-500 text-white py-2 hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div> */}
    </aside>
  );
};
