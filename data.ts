export type Sermon = {
  title: string;
  speaker: string;
  topic: string;
  link: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  imageSrc?: string;
};
import React, { ReactNode } from "react";

type Lecture = {
  title: string;
  date: string;
  location: string;
  type: string;
};

export const MOCK_LECTURES: Lecture[] = [
  {
    title: "দানের নীতি (The Ethics of Giving)",
    date: "অক্টোবর ২৬, ২০২৪",
    location: "কুলিয়ন ওয়েলফেয়ার",
    type: "live",
  },
  {
    title: "বিপর্যস্তের মুখে (The Face of Adversity)",
    date: "অক্টোবর ২৬, ২০২৪",
    location: "কমিউনিটি সেন্টার",
    type: "online",
  },
];

export const MOCK_SERMONS: Sermon[] = [
  {
    title: "শক্তির উৎস (The Power Isak)",
    speaker: "মার্চ ০৫, ২০২৪ · ইসলামিক সেন্টার",
    topic: "জ্ঞান ও প্রজ্ঞা",
    link: "#",
  },
  {
    title: "আল-সউল যাত্রা (The Journey on Surat Al Al-Soull)",
    speaker: "এপ্রিল ০৫, ২০২৪ · দুবাই ইসলামিয়া",
    topic: "আত্মশুদ্ধি",
    link: "#",
  },
  {
    title: "দৈনন্দিন জীবনে সতর্কতা (Prepardic Cooikance For Daily Life)",
    speaker: "মে ০৫, ২০২৪ · মসজিদ আল-কারিম",
    topic: "দৈনন্দিন জীবন",
    link: "#",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "ড. ওমরের কথাগুলো আমার জীবনকে সত্যিকারের অনুপ্রেরণামূলক উপায়ে বদলে দিয়েছে।",
    author: "সারাহ কে.",
    imageSrc: "https://placehold.co/50x50/e0e0e0/555?text=SK",
  },
  {
    quote:
      "তাঁর আলোচনা ছিল আলোর মিনার এবং এটি সত্যি সত্যিই প্রজ্ঞা এবং জ্ঞান নিয়ে আলোকিত করেছে।",
    author: "আহমেদ এম.",
    imageSrc: "https://placehold.co/50x50/d1e7dd/155724?text=AM",
  },
];
// FIXED MASTER NAV MENU
export const MASTER_NAV_LINKS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "#about" },
  { id: 3, name: "Videos", href: "#youtubevideos" },
  { id: 4, name: "Gallary", href: "#gallery" },
  { id: 5, name: "Proggams", href: "#programs" },
  { id: 6, name: "Social", href: "#social" },
  { id: 7, name: "Contact", href: "#contact" },
  { id: 8, name: "Organizations", href: "#organizations" },
  { id: 9, name: "Books", href: "#books" },
  { id: 10, name: "Testimonials", href: "#testimonials" },
  { id: 11, name: "Education", href: "#education" },
  { id: 12, name: "Achivments", href: "#achievements" },
  { id: 13, name: "Blogs", href: "#blog" },
  { id: 14, name: "Certificate", href: "#certificates" },
  { id: 15, name: "Team", href: "#teams" },
  { id: 16, name: "Appoinment", href: "#booking" },
];
