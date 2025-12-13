"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import toast from "react-hot-toast";

// ============================
// লজিক অংশ - কোনো পরিবর্তন নেই
// ============================
export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // Current Data
  const [CurrentUser, setCurrentUser] = useState("");
  const [CurrentHashedPassword, setCurrentHashedPassword] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [newUser, setNewUser] = useState("");

  // Fetch user data from API (অপরিবর্তিত)
  useEffect(() => {
    async function fetchUser() {
      // (Fetching logic unchanged)
      try {
        const res = await fetch("/api/all-data/usersection");
        const data = await res.json();
        if (data.success) {
          const userData = data.groupedData.usersection.data;
          setCurrentUser(userData.user);
          setCurrentHashedPassword(userData.password);
          setNewUser(userData.user);
        }
      } catch (err) {
        toast.error("Failed to load user data");
      }
    }
    fetchUser();
  }, []);

  // Login Handler (অপরিবর্তিত)
  const handleLogin = async (e: React.FormEvent) => {
    // (Login logic unchanged)
    e.preventDefault();
    const loadingToast = toast.loading("Checking credentials...");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mobile, password }),
      });
      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!data.success) throw new Error(data.message || "Login failed");

      toast.success("✅ Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
    }
  };

  // Change Password Handler (অপরিবর্তিত)
  const handleChangePassword = async () => {
    // (Password change logic unchanged)
    if (!oldPass || !newPass || !confirmPass || !newUser) {
      toast.error("All fields are required!");
      return;
    }

    // First, verify old password
    const verifyRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: CurrentUser, password: oldPass }),
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      toast.error("Old password is incorrect!");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match!");
      return;
    }

    const loadingToast = toast.loading("Updating password...");

    try {
      // Update new user & password via API
      const res = await fetch("/api/all-data/usersection/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            user: newUser,
            password: newPass, // API should hash before saving
          },
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");

      toast.dismiss(loadingToast);
      toast.success("✅ Email/Mobile & Password updated successfully!");
      setIsModalOpen(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setCurrentUser(newUser);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Update failed");
    }
  };

  // ============================
  // **** এখানে শুধুমাত্র ডিজাইন পরিবর্তন করা হয়েছে: ২-কলাম লেআউট যোগ ****
  // ============================
  return (
    <div
      className="relative flex items-center justify-center min-h-screen 
      bg-white dark:bg-gray-900 
      sm:bg-gradient-to-br sm:from-blue-50 sm:to-gray-100 dark:sm:from-gray-900 dark:sm:to-gray-800 p-4"
    >
      {/* Card Container for both Image and Form (2-column on large screens) */}
      <div
        className={`
        bg-white dark:bg-gray-900 
        shadow-2xl sm:rounded-2xl sm:border border-gray-200 dark:border-gray-700
        w-full sm:w-auto sm:max-w-4xl 
        flex flex-col sm:flex-row 
        ${isModalOpen ? "blur-sm pointer-events-none" : ""} 
        transition-all duration-300
      `}
      >
        {/* === ১. ইমেজ/আইকন কন্টেইনার (ল্যাপটপে দৃশ্যমান, মোবাইলে অদৃশ্য) === */}
        <div
          className="
          hidden lg:flex items-center justify-center 
          w-1/2 p-8 
          bg-blue-600 dark:bg-blue-800 
          rounded-l-2xl 
          text-white
        "
        >
          <div className="text-center">
            {/* আপনি এখানে SVG আইকন বা Next.js Image কম্পোনেন্ট ব্যবহার করতে পারেন */}
            <svg
              className="w-20 h-20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m3-4a3 3 0 013-3h.01M21 12h-2m-9 0H3"
              ></path>
            </svg>
            <h3 className="text-3xl font-bold">Welcome Back!</h3>
            <p className="mt-2 text-blue-100">
              Access your dashboard securely.
            </p>
          </div>
        </div>
        {/* === ২. লগইন ফর্ম কন্টেইনার === */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12">
          <form onSubmit={handleLogin}>
            {/* ... (লগইন ফর্মের ভেতরের অংশ অপরিবর্তিত) */}
            <div className="p-1 rounded-2xl border dark:text-white text-black text-xs mb-4">
              <p>Mobile:01858226967</p>
              <p>Password:123456</p>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              Login
            </h2>

            <Input
              size="md"
              type="text"
              placeholder=""
              label="Mobile/User"
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

            {/* open modal */}
            <p
              className="text-center text-blue-600 cursor-pointer mt-4 hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              Change Password?
            </p>
          </form>
        </div>
      </div>

      {/* ============================
          Change Password Modal (অপরিবর্তিত)
      ============================ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-lg border z-10">
            <h3 className="text-xl font-semibold text-center mb-4">
              Change User / Password
            </h3>

            {/* Input fields... (অপরিবর্তিত) */}
            <Input
              label="Mobile/User"
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="mb-3"
              isRequired
            />
            <Input
              label="Old Password"
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="mb-3"
              isRequired
            />
            <Input
              label="New Password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="mb-3"
              isRequired
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="mb-4"
              isRequired
            />

            <Button
              color="primary"
              variant="shadow"
              className="w-full mb-2"
              onClick={handleChangePassword}
            >
              Update
            </Button>

            <Button
              color="danger"
              variant="flat"
              className="w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
