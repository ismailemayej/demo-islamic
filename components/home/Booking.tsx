"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import toast from "react-hot-toast";

export const AppointmentSection: React.FC = () => {
  const [formData, setFormData] = useState({
    programName: "",
    duration: "",
    date: "",
    contact: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit এর মধ্যে
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.programName ||
      !formData.duration ||
      !formData.date ||
      !formData.contact ||
      !formData.details
    ) {
      toast.error("সব ফিল্ড পূরণ করুন!");
      return;
    }

    toast.loading("Sending appointment...", { id: "appointment" });

    try {
      const res = await fetch("/api/send-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Send failed");

      toast.dismiss("appointment");
      toast.success("অ্যাপয়েন্টমেন্ট সফলভাবে পাঠানো হয়েছে!");

      setFormData({
        programName: "",
        duration: "",
        date: "",
        contact: "",
        details: "",
      });
    } catch (err: any) {
      toast.dismiss("appointment");
      toast.error(err.message || "Send failed");
    }
  };

  return (
    <Background id="booking">
      <div className="container mx-auto lg:px-8 bangla">
        <Heading
          title="অ্যাপয়েন্টমেন্ট"
          subTitle="নিচের ফর্মটি পূরণ করে আমাদের প্রোগ্রাম বুক করুন"
        />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4 sm:mb-0">
              <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
                প্রোগ্রামের নাম
              </label>
              <input
                type="text"
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="mb-4 sm:mb-0">
              <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
                কত দিন
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
                তারিখ-সাল-মাস
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
                যোগাযোগের মাধ্যম
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="মোবাইল / ইমেইল"
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
              প্রোগ্রামের বিস্তারিত
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-emerald-600 dark:bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
          >
            সাবমিট
          </button>
        </motion.form>
      </div>
    </Background>
  );
};
