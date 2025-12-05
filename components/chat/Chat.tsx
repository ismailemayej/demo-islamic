"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Background from "../background";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function ChatBox() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamText, setStreamText] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, streamText]);

  const typeWriterEffect = async (fullText: string) => {
    setStreamText("");
    for (let i = 0; i < fullText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15));
      setStreamText((prev) => prev + fullText[i]);
    }
    setMessages((prev) => [...prev, { role: "model", text: fullText }]);
    setStreamText("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userMessage = inputMessage.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const modelResponseText: string =
        data.message || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";

      await typeWriterEffect(modelResponseText);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "❗দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const name = process.env.NEXT_PUBLIC_OWNER_NAME || "AI Assistant";

  return (
    <div
      className="
                   w-[90vw] sm:w-[400px] md:w-[450px] 
                   h-[70vh] sm:h-[75vh] md:h-[80vh] 
                  bg-gradient-to-br 
          from-blue-50 via-cyan-50 to-blue-100
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col"
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10 dark:text-gray-400">
            ✨ HI IM {name}, can I help you?
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 max-w-[75%] rounded-2xl whitespace-pre-wrap text-sm shadow
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900 dark:bg-[#333] dark:text-white"
                  }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {streamText && (
          <div className="flex justify-start">
            <div className="px-4 py-2 max-w-[75%] rounded-2xl bg-gray-200 text-gray-900 shadow whitespace-pre-wrap dark:bg-[#333] dark:text-white">
              {streamText}
              <span className="animate-pulse">▌</span>
            </div>
          </div>
        )}

        {isLoading && !streamText && (
          <div className="flex justify-start h-6">
            <div className="px-4 py-2 max-w-[75%] rounded-2xl bg-gray-200 dark:bg-[#333] shadow flex items-center space-x-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-0"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      {/* Input box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 w-full"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 
               bg-gray-100 dark:bg-[#333] dark:text-white 
               focus:outline-none text-sm sm:text-base min-w-0"
        />

        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-blue-700 
               text-white rounded-full shadow-lg 
               flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            // Loading animation (square pulse)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-pulse text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          ) : (
            // 3D Send icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
