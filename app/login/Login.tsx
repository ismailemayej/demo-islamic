"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button, Input } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch usersection from API
      const res = await fetch("/api/all-data/usersection");
      const json = await res.json();

      const dbUser = json.groupedData.usersection.data.user;
      const dbPassword = json.groupedData.usersection.data.password;

      if (user === dbUser && password === dbPassword) {
        toast.success("Login Successful!");

        // ✅ Set cookie via API
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loggedIn: true }),
        });

        router.push("/dashboard");
      } else {
        toast.error("Invalid Credentials!");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-100 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-500 px-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 w-full max-w-sm flex flex-col gap-6 transform transition-transform duration-300 hover:scale-105"
      >
        <h2 className="bangla text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 text-center mb-4">
          লগইন করুন
        </h2>

        {/* Mobile Input */}
        <div className="flex flex-col gap-1">
          <label className="bangla text-gray-600 dark:text-gray-300 font-medium bangla">
            মোবাইল নাম্বার
          </label>
          <Input
            type="text"
            placeholder="018XXXXXXXX"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1">
          <label className="bangla text-gray-600 dark:text-gray-300 font-medium bangla">
            পাসওয়ার্ড
          </label>
          <Input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          color="success"
          variant="solid"
          size="lg"
          className="w-full py-3 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <span className="bangla animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent mx-auto"></span>
          ) : (
            "লগইন"
          )}
        </Button>
      </form>
    </div>
  );
}
