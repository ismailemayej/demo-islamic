"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

import ChatBox from "./Chat";
import { OpenModal } from "../Modal";

export default function ChatWrapper() {
  const name = process.env.NEXT_PUBLIC_OWNER_NAME || "AI Assistant";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 
        text-white p-3 rounded-full shadow-lg z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l1.8 4.7 4.7 1.8-4.7 1.8-1.8 4.7-1.8-4.7-4.7-1.8 4.7-1.8L12 2zm6.5 11.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5zM4.5 13.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z" />
        </svg>
      </button>

      {/* Reusable OpenModal */}
      <OpenModal
        title={`Chat with ${name}`}
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
      >
        <ChatBox />
      </OpenModal>
    </>
  );
}
