import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
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
  metadataBase: new URL("https://aivideofinder.com"),
  title: { default: "AI Video Tool Finder", template: "%s" },
  description: "Compare AI video generation and editing tools by use case.",
  verification: {
    other: {
      "impact-site-verification": "ae5f6e92-967e-4958-a57c-79b2016ec63b",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
