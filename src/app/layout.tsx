import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Viroqua Business Guide",
  description: "Discover local businesses in Viroqua, Wisconsin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 dark:bg-zinc-950`}
      >
        <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Viroqua<span className="text-emerald-600">Guide</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-400">
                Home
              </Link>
            </div>
          </div>
        </nav>
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
