// Remove 'use client'; - This remains a Server Component

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
// Remove useSession import - no longer needed here
// import { useSession } from "next-auth/react"; 
import MainLayoutClient from "./components/MainLayoutClient"; // Import the new client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Keep metadata export here
export const metadata = {
  title: "API Key Management",
  description: "Manage your API keys",
};

export default function RootLayout({ children }) {
  // Remove useSession hook - no longer needed here
  // const { status } = useSession();
  // const isAuthenticated = status === 'authenticated';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <SessionProviderWrapper>
          {/* Render the client component, passing children */}
          <MainLayoutClient>{children}</MainLayoutClient> 
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
