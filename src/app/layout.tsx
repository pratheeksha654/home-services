import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";
import NavbarWrapper from "@/components/navbar-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeFixPro – Sign Up | Book Trusted Home Services",
  description:
    "Create your HomeFixPro account and book trusted home repair & field services in just a few clicks. Professional, reliable, and affordable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <NavbarWrapper />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}