"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Background from "../background";

// Chat message interface
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

  // Scroll to bottom automatically
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, streamText]);

  // Typewriter effect
  const typeWriterEffect = async (fullText: string) => {
    setStreamText(""); // reset
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

    // Add user message
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
    <Background id="chat">
      <div className="max-w-xl mx-auto mt-6 rounded-xl border border-gray-300 shadow-lg flex flex-col h-[80vh] bg-white dark:bg-[#1a1a1a]">
        {/* Header */}
        <h1 className="text-center py-3 border-b text-lg font-semibold dark:text-white">
          Chat with{" "}
          <span className="dark:text-yellow-500 text-green-400">{name}</span>
        </h1>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-10 dark:text-gray-400">
              ✨ HI IM {name} can i help you?
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

          {/* Streaming response */}
          {streamText && (
            <div className="flex justify-start">
              <div className="px-4 py-2 max-w-[75%] rounded-2xl bg-gray-200 text-gray-900 shadow whitespace-pre-wrap dark:bg-[#333] dark:text-white">
                {streamText}
                <span className="animate-pulse">▌</span>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isLoading && !streamText && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-2xl dark:bg-[#333] dark:text-white">
                ...টাইপ করছে
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          className="flex p-3 border-t bg-white dark:bg-[#222]"
        >
          <input
            type="text"
            placeholder="আপনার মেসেজ লিখুন..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#333] dark:text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm disabled:bg-blue-300"
          >
            পাঠান
          </button>
        </form>
      </div>
    </Background>
  );
}
