"use client";
import { useGetSection } from "@/app/dashboard/Hook/GetData";
export const Footer: React.FC = () => {
  const { section, loading, error } = useGetSection("websitesection");
  return (
    <footer className="mt-3 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-8 transition-colors duration-500">
      <div className="container mx-auto px-4 text-center space-y-4">
        {/* Copyright */}
        <p className="text-gray-500 dark:text-gray-400 text-md mt-4 bangla">
          &copy; {new Date().getFullYear()} {section?.data?.ownerName} All
          rights reserved.
        </p>

        {/* Created by + WhatsApp */}
        <p className="text-gray-600 dark:text-gray-300 bangla">
          Created by
          <a
            href="https://wa.me/8801858226967"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Md Ismaile Hossain
          </a>
        </p>
      </div>
    </footer>
  );
};
