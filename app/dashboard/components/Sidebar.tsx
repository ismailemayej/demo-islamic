import { useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
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
  Menu,
} from "lucide-react";
import { SidebarProfile } from "./DashboardProfile";
import { ScrollShadow } from "@nextui-org/react";
import { DraggableList } from "../Hook/DraggableList";

// 🧠 Type for Sidebar Link
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
      id: "16",
      name: "Dashboard",
      icon: <Menu size={18} />,
      href: "/dashboard",
    },
    {
      id: "1",
      name: "HeroSection",
      icon: <BookOpen size={18} />,
      href: "/dashboard/herosection",
    },
    {
      id: "2",
      name: "AboutSection",
      icon: <User size={18} />,
      href: "/dashboard/about",
    },
    {
      id: "3",
      name: "Achievements",
      icon: <Award size={18} />,
      href: "/dashboard/achievements",
    },
    {
      id: "4",
      name: "Blog",
      icon: <FileText size={18} />,
      href: "/dashboard/blog",
    },
    {
      id: "5",
      name: "Booking",
      icon: <Calendar size={18} />,
      href: "/dashboard/booking",
    },
    {
      id: "6",
      name: "Certificate",
      icon: <Star size={18} />,
      href: "/dashboard/certificate",
    },
    {
      id: "7",
      name: "Contact",
      icon: <Mail size={18} />,
      href: "/dashboard/contact",
    },
    {
      id: "8",
      name: "Education",
      icon: <Book size={18} />,
      href: "/dashboard/education",
    },
    {
      id: "9",
      name: "Gallery",
      icon: <Image size={18} />,
      href: "/dashboard/gallery",
    },
    {
      id: "10",
      name: "Programs",
      icon: <Grid size={18} />,
      href: "/dashboard/programs",
    },
    {
      id: "11",
      name: "Organization",
      icon: <Users size={18} />,
      href: "/dashboard/organization",
    },
    {
      id: "12",
      name: "SocialMedia",
      icon: <Smile size={18} />,
      href: "/dashboard/socialmedia",
    },
    {
      id: "13",
      name: "Teams",
      icon: <Users size={18} />,
      href: "/dashboard/teams",
    },
    {
      id: "14",
      name: "Testimonials",
      icon: <Star size={18} />,
      href: "/dashboard/testimonials",
    },
    {
      id: "15",
      name: "YoutubeVideos",
      icon: <Tv size={18} />,
      href: "/dashboard/youtube",
    },
  ]);

  return (
    <aside className="flex flex-col h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <SidebarProfile />

      <ScrollShadow
        hideScrollBar
        className="flex-1 overflow-y-auto px-2 lg:mb-0 mb-30"
      >
        <DraggableList<SidebarLink>
          items={links}
          getId={(item: SidebarLink) => item.id}
          onChange={setLinks}
          renderItem={(link: SidebarLink) => (
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
          )}
        />
      </ScrollShadow>
    </aside>
  );
};
