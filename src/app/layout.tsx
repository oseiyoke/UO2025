import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { PostsProvider } from "./context/PostsContext";
import PostsLoadingControl from "./components/PostsLoadingControl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Obose & Unwana's Wedding",
  description: "Join us for our special day - April 12, 2025",
  manifest: "/manifest.json",
  themeColor: "#FDF2F8",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Obose & Unwana's Wedding",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/wedding-logo/UO2025.png" />
        <link rel="apple-touch-startup-image" href="/wedding-logo/UO2025.png" />
        <link rel="icon" href="/wedding-logo/UO2025.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#FDF2F8" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} antialiased bg-gradient-to-br from-pink-50 via-white to-purple-50`}
      >
        <PostsProvider>
          <PostsLoadingControl />
          <div className="pb-28">
            {children}
            <Navbar />
          </div>
        </PostsProvider>
      </body>
    </html>
  );
}
