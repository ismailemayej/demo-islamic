"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mobile, password }),
    });

    const data = await res.json();

    if (data.success) {
      setAlert({ type: "success", msg: "✅ Login successful!" });
      setTimeout(() => router.push("/dashboard"), 1200);
    } else {
      setAlert({ type: "error", msg: "❌ Invalid email or password!" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-80 border border-gray-200 dark:border-gray-700 transition-all"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          Login
        </h2>

        {alert && (
          <Alert
            color={alert.type === "success" ? "success" : "danger"}
            variant="flat"
            className="mb-4 text-sm"
          >
            {alert.msg}
          </Alert>
        )}

        <Input
          size="md"
          type="text"
          label="Email or Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="mb-3"
          isRequired
        />

        <Input
          size="md"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          isRequired
        />

        <Button
          type="submit"
          color="primary"
          variant="shadow"
          className="w-full font-semibold"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
