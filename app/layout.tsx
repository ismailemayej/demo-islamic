export const revalidate = 60;

import "@/styles/globals.css";
import { Providers } from "./providers";
// import { fontSans } from "@/config/fonts"; // <-- DELETED: We will define the fonts directly here
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { Metadata } from "next";
// --- FONT FIX: Import both Poppins and Tiro_Bangla from next/font/google ---
import { Poppins, Tiro_Bangla } from "next/font/google";

// 1. Poppins (English/Default)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins", // This will replace your old --font-sans
  display: "swap",
});

// 2. Tiro Bangla (Bengali/Custom)
const tiroBangla = Tiro_Bangla({
  subsets: ["bengali"],
  weight: ["400"],
  variable: "--font-tirobangla",
  display: "swap",
});

interface WebsiteSection {
  id: string;
  ownerName: string;
  description: string;
  keywords?: string;
  profileImage?: string;
  author?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function getWebsiteSection(): Promise<WebsiteSection | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data/websitesection`,
      {
        // F I X: Dynamic server usage ত্রুটি দূর করতে cache: "no-store" এর পরিবর্তে ISR (60 সেকেন্ড) ব্যবহার করা হলো।
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data?.groupedData?.websitesection?.data || null;
  } catch (error) {
    console.error("❌ Failed to fetch website section:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const section = await getWebsiteSection();

  const title =
    section?.ownerName || "Md Ismail Hossain | MERN Stack Developer";
  const description =
    section?.description ||
    "Personal portfolio website of Md Ismail Hossain — a passionate MERN Stack Developer from Bangladesh specializing in modern web applications.";
  const keywords =
    section?.keywords ||
    "MERN Stack, Web Developer, Next.js, React, Node.js, Portfolio, Bangladesh, Developer";

  const image =
    section?.profileImage ||
    "https://ismaile-web-developer.vercel.app/og-image.png";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url:
        section?.url ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://ismaile-web-developer.vercel.app",
      siteName: title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Portfolio of Md Ismail Hossain",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: [image || "/favicon.ico"],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="bn">
      <head>
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
        />
      </head>

      <body
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased",

          poppins.variable,
          tiroBangla.variable,

          "font-sans",
          "font-[var(--font-tirobangla)]"
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Toaster position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
