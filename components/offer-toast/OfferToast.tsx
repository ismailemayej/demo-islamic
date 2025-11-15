"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  useEffect(() => {
    // Check if user has already dismissed
    const dismissed = localStorage.getItem("promoToastDismissed");
    if (dismissed) return;

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between`}
        >
          <span>
            অল্প খরচে এমন একটি ওয়েব সাইট বানিয়ে নিন। যোগাযোগঃ
            <a
              href="https://wa.me/01858226967"
              target="_blank"
              className="underline ml-1"
            >
              ০১৮৫৮২২৬৯৬৭
            </a>
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              localStorage.setItem("promoToastDismissed", "true"); // Save dismissal
            }}
            className="ml-4 font-bold text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      ),
      { duration: Infinity } // নিজেরে বন্ধ হবে না, শুধু cross থেকে বন্ধ হবে
    );
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-center text-2xl mt-20">ওয়েলকাম টু মাই ওয়েবসাইট</h1>
    </div>
  );
}
