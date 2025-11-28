"use client";
import { useState } from "react";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!msg) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setReply(data.reply || "No reply from AI");
    } catch (err) {
      setReply("Error: Could not fetch AI response");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Chat (Google Gemini)</h2>

      <textarea
        className="w-full border p-3 rounded"
        rows={3}
        placeholder="Write your message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Send
      </button>

      {loading && <p className="mt-3 text-gray-500">Thinking...</p>}

      {reply && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <strong>AI:</strong> {reply}
        </div>
      )}
    </div>
  );
}
