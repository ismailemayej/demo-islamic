import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Tiro_Bangla as FontBangla,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontBangla = FontBangla({
  weight: ["400"],
  subsets: ["bengali"],
  variable: "--font-bangla",
});
