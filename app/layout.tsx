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
  title: "FD MAKAN - Seal The Deal | Real Estate Excellence",
  description: "FD MAKAN - Your trusted partner in real estate. Find your dream property, sell with confidence, and seal the deal with our expert team.",
  icons: {
    icon: [
      { url: '/fd_makan_logo-removebg-preview.png', type: 'image/png' },
      { url: '/fd_makan_logo-removebg-preview.png', sizes: '32x32', type: 'image/png' },
      { url: '/fd_makan_logo-removebg-preview.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/fd_makan_logo-removebg-preview.png',
    apple: [
      { url: '/fd_makan_logo-removebg-preview.png', sizes: '180x180', type: 'image/png' },
    ],
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
