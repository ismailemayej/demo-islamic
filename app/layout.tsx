import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { Toaster } from "react-hot-toast";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/all-data/websitesection`,
      {
        cache: "no-store",
      }
    );
    const sectiondata = await res.json();
    const section = sectiondata?.groupedData?.websitesection;
    return {
      title: {
        default: section?.data?.sitetitle || "Default Site Title",
        template: `%s - ${section?.data?.sitetitle || "Default Site Title"}`,
      },
      description: section?.data?.description || "Default site description",
      icons: {
        icon: section?.data.profileImage || "/favicon.ico",
      },
    };
  } catch (err) {
    console.error("Failed to fetch site data", err);
    return {
      title: "Default Site Title",
      description: "Default site description",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
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
