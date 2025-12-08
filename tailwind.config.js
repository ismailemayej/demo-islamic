// tailwind.config.js
import { heroui } from "@heroui/theme";
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Fixed Keyframes (MUST be inside extend)
      keyframes: {
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },

      animation: {
        shine: "shine 1s ease-in-out infinite",
      },

      fontFamily: {
        // English default
        sans: ["var(--font-poppins)", ...fontFamily.sans],

        // Bangla
        bangla: ["var(--font-tirobangla)", ...fontFamily.sans],

        // Mono
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
    },
  },

  darkMode: "class",

  plugins: [heroui()],
};

module.exports = config;
