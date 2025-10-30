"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heading } from "../Heading";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email link using mailto:
    const mailtoLink = `mailto:ismaile535@gmail.com?subject=Appointment Request: ${encodeURIComponent(
      formData.programName
    )}&body=${encodeURIComponent(
      `Program Name: ${formData.programName}\nDuration: ${formData.duration}\nDate: ${formData.date}\nContact: ${formData.contact}\nDetails: ${formData.details}`
    )}`;

    window.location.href = mailtoLink;
  };

  return (
    <section
      id="appointment"
      className="py-10 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 bangla"
    >
      <div className="container mx-auto lg:px-8">
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
    </section>
  );
};
