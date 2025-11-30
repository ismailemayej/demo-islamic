"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import toast from "react-hot-toast";

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

  // Fetch user data from API
  useEffect(() => {
    async function fetchUser() {
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

  // ============================
  // Login Handler with hashed password
  // ============================
  const handleLogin = async (e: React.FormEvent) => {
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

  // ============================
  // Change Password Handler with hashed password
  // ============================
  const handleChangePassword = async () => {
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
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Apply blur when modal is open */}

      <div
        className={`${isModalOpen ? "blur-sm pointer-events-none" : ""} transition-all`}
      >
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-80 border border-gray-200 dark:border-gray-700"
        >
          <div className="p-1 rounded-2xl border dark:text-white text-black">
            <p>Mobile:01858226967</p>
            <p>Password:123456</p>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
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

      {/* ============================
          Change Password Modal with Background Blur
      ============================ */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent blurred background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-lg border z-10">
            <h3 className="text-xl font-semibold text-center mb-4">
              Change User / Password
            </h3>

            {/* User input */}
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
