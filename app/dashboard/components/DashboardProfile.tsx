"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";
import { useGetSection } from "../Hook/GetData";

export const SidebarProfile = () => {
  const { section, loading, error } = useGetSection("websitesection");
  const imageUrl = section?.data?.profileImage;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        {imageUrl && (
          <div className="relative group">
            <Image
              src={imageUrl}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-green-500 object-cover"
            />
          </div>
        )}
      </div>

      <h2 className="lg:block hidden text-xl font-semibold text-gray-800 dark:text-gray-100">
        Dashboard
      </h2>
    </div>
  );
};
