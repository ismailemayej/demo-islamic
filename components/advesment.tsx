import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const TopAdBanner = () => {
  return (
    <div className=" bg-emerald-600 text-white w-full shadow-md">
      <div className="flex items-center justify-center gap-2 px-3 py-2">
        <p className="text-md sm:text-md font-semibold truncate text-center bangla">
          অল্প টাকায় এমন নিজের নামে ওয়েবসাইট বানাতে যোগাযোগ করুন!
        </p>
        <a
          href="https://wa.me/8801858226967"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white hover:text-amber-200"
        >
          <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className=" lg:block hidden">WhatsApp করুন</span>
        </a>
      </div>
    </div>
  );
};

export default TopAdBanner;
