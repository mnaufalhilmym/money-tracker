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
        className={`${karla.className} antialiased max-w-md mx-auto p-4 bg-black text-white text-sm`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
