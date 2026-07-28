import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothly — Fashion for Everyone",
  description: "Curated collections for men, women & kids.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <div className="hidden md:block">
            <SideBar />
          </div>
          <main className="min-h-screen md:ml-[240px] pt-[8.5rem] px-4 md:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
