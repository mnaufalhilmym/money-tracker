import Footer from "@/component/footer/Footer";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Karla } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";

const karla = Karla({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Track your spending and saving",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>

      <body
        className={`max-w-md mx-auto flex flex-col bg-black text-white text-sm ${karla.className} antialiased`}
      >
        <main className="min-h-screen flex-1 p-4">{children}</main>

        <div className="mt-4 space-y-2">
          <div className="h-0.5 bg-white/20" />

          <Footer />
        </div>
      </body>
    </html>
  );
}
