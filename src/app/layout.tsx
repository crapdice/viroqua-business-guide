import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
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
        className={`${lora.variable} ${inter.variable} antialiased min-h-screen bg-[#FDFCFB] text-[#3A332E] selection:bg-[#E2E8D4]`}
      >
        <nav className="fixed top-0 z-50 w-full border-b border-[#EBE3D5] bg-[#FDFCFB]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#2D2825]">
              Viroqua<span className="text-[#3E5C3D]">Guide</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="font-sans text-sm font-semibold tracking-wide uppercase text-[#6B5E55] hover:text-[#3E5C3D] transition-colors">
                Explore
              </Link>
              <Link href="/trails" className="font-sans text-sm font-semibold tracking-wide uppercase text-[#6B5E55] hover:text-[#3E5C3D] transition-colors">
                Trails
              </Link>
              <Link href="/pulse" className="font-sans text-sm font-semibold tracking-wide uppercase text-[#6B5E55] hover:text-[#3E5C3D] transition-colors">
                Pulse
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
