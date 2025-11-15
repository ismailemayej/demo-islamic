import "@/styles/globals.css";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { Metadata } from "next";
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

// ✅ server-side fetch function
async function getWebsiteSection(): Promise<WebsiteSection | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data/websitesection`,
      { cache: "no-store" }
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
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Google verification static */}
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
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
