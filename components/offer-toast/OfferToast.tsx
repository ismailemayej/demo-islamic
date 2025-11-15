"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";

export default function OfferPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("offerPopupDismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("offerPopupDismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Popup content */}
      <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col items-center space-y-4 animate-fadeIn border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg md:text-xl font-bold text-center">
          Special Offer!
        </h3>
        <p className="text-sm md:text-base text-center">
          অল্প খরচে এমন একটি ওয়েব সাইট বানিয়ে নিন। যোগাযোগ:{" "}
          <a
            href="https://wa.me/01858226967"
            target="_blank"
            className="underline text-indigo-600 dark:text-indigo-400"
          >
            01858226967
          </a>
        </p>
      </div>
    </div>
  );
}
