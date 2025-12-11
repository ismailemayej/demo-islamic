"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/background";
import { Heading } from "@/components/Heading";
import toast from "react-hot-toast";
import { Input, Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

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
      <Heading
        title=" Appointment"
        subTitle=" book an appointment for a program"
      />

      <motion.form
        onSubmit={handleSubmit}
        className="mt-10 bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4 sm:mb-0">
            <Input
              label="Program Name"
              size="md"
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 sm:mb-0">
            <Input
              label="Day"
              size="md"
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <DatePicker
              label=""
              name="date"
              value={formData.date ? parseDate(formData.date) : null}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  date: value?.toString() || "", // Convert DateValue → string
                }))
              }
            />
          </div>

          <div>
            <Input
              label="Mobile / Email"
              size="md"
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Details"
            size="lg"
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-emerald-600 dark:bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 "
        >
          Submit
        </button>
      </motion.form>
    </Background>
  );
};
