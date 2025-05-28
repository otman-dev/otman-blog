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
  title: "Otman - Personal Insights and Innovation",
  description: "Otman brings you personal insights, innovations, and thought leadership. Discover perspectives on technology and more with forward-thinking perspectives.",
  keywords: "Otman, personal blog, innovation, technology, insights, thought leadership, programming, development",
  authors: [{ name: "Otman" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",  openGraph: {
    title: "Otman - Personal Insights and Innovation",
    description: "Personal insights and innovations. Discover perspectives on technology with forward-thinking ideas.",
    type: "website",
    locale: "en_US",
    siteName: "Mouhib Otman",
    images: [
      "https://enterprise-blog.vercel.app/LogoMouhibOtman.svg"
    ]
  },  twitter: {
    card: "summary_large_image",
    title: "Mouhib Otman - Personal Insights and Innovation",
    description: "Personal insights and innovations. Discover perspectives on technology with forward-thinking ideas.",
    images: [
      "https://enterprise-blog.vercel.app/LogoMouhibOtman.svg"
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
