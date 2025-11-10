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

    const title = section?.data?.sitetitle || "Default Site Title";
    const description =
      section?.data?.description || "Default site description";
    const image = section?.data?.profileImage || "/favicon.ico";

    return {
      title: {
        default: title,
        template: `%s - ${title}`,
      },
      description,
      icons: {
        icon: image || "/favicon.ico", // browser favicon
      },
      openGraph: {
        title,
        description,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: title,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
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
