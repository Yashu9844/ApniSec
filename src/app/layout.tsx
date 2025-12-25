import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApniSec | Next-Gen Cybersecurity Platform",
  description:
    "Enterprise-grade security vulnerability management. Detect, analyze, and remediate threats with AI-powered insights.",
  keywords: "cybersecurity, vulnerability management, VAPT, cloud security, penetration testing, security platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030303] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
