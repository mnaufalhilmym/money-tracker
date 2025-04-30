import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Track your spending and saving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.className} antialiased max-w-md mx-auto p-4 bg-black text-white text-sm`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
