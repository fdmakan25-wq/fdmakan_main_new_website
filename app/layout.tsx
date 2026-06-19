import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FloatingContact from "@/components/FloatingContact";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FD Makan",
  description: "FD Makan - Your trusted partner in real estate. Find your dream property, sell with confidence, and seal the deal with our expert team.",
  icons: {
    icon: '/fd_makan_logo-removebg-preview.png',
    shortcut: '/fd_makan_logo-removebg-preview.png',
    apple: '/fd_makan_logo-removebg-preview.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
