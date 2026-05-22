import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
});

import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "GadgetHub - Gadgets & Electronics",
  description: "Your trusted destination for mobiles, tablets, smartwatches, earphones, chargers and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
