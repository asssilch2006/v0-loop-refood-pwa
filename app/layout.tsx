import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";

import "./globals.css";
import "./rtl.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Loop Refood - Save Food, Save Money",
  description:
    "Join the circular food economy. Find discounted meals, reduce waste, and make a positive impact.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loop Refood",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9668",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${inter.variable} ${ibmPlexArabic.variable} font-sans antialiased overflow-x-hidden`}
      >
        <div className="min-h-screen w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
