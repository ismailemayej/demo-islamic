"use client";
import Image from "next/image";
import { useGetSection } from "../Hook/GetData";

export const SidebarProfile = () => {
  const { section } = useGetSection("websitesection");
  const imageUrl = section?.data?.profileImage;
  const name = section?.data?.ownerName;

  return (
    <div className=" flex flex-col items-center justify-center py-2 border-b border-gray-200 dark:border-gray-800 px-2">
      <div className="relative">
        {imageUrl && (
          <div className="relative group">
            <Image
              src={imageUrl}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full border-2 border-green-500 object-cover"
            />
          </div>
        )}
      </div>

      <h2 className=" bangla text-center text-md lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
        {name}
      </h2>
    </div>
  );
};
