import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecondWind — Thrift, Digitized",
  description:
    "AI-powered thrift store inventory. Browse secondhand finds near you and save the planet while you're at it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
