// tailwind.config.js
import { heroui } from "@heroui/theme";
// Import 'fontFamily' from defaultTheme for clean extension
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  // --- Custom Keyframes (Kept Existing) ---
  keyframes: {
    shine: {
      "0%": { left: "-100%" },
      "100%": { left: "100%" },
    },
  },

  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        // 1. English (Poppins) as default 'sans' font
        sans: ["var(--font-poppins)", ...fontFamily.sans], // 2. Bengali (Tiro Bangla) custom 'bangla' font utility

        bangla: ["var(--font-tirobangla)", ...fontFamily.sans], // Mono font is kept, assuming it uses a variable

        mono: ["var(--font-mono)", ...fontFamily.mono],
      }, // Ensure keyframes are inside 'extend' if you want them merged with default ones
      animation: {
        shine: "shine 1s ease-in-out infinite",
      },
    },
  },

  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
