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
  title: "AtlanticDunes - Enterprise Insights and Innovation",
  description: "AtlanticDunes brings you cutting-edge enterprise insights, industry innovations, and strategic thought leadership. Discover the future of business with our expert analysis and forward-thinking perspectives.",
  keywords: "AtlanticDunes, enterprise, innovation, business insights, industry analysis, thought leadership, strategy, technology, business intelligence",
  authors: [{ name: "AtlanticDunes Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AtlanticDunes - Enterprise Insights and Innovation",
    description: "Cutting-edge enterprise insights and industry innovations. Discover the future of business with expert analysis and forward-thinking perspectives.",
    type: "website",
    locale: "en_US",
    siteName: "AtlanticDunes",
  },
  twitter: {
    card: "summary_large_image",
    title: "AtlanticDunes - Enterprise Insights and Innovation",
    description: "Cutting-edge enterprise insights and industry innovations. Discover the future of business with expert analysis.",
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
