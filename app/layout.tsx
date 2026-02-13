import "./globals.css";
import type { Metadata } from "next";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { NextAuthProvider } from "@/app/components/NextAuthProvider";

export const metadata: Metadata = {
  title: "Valorant Skin Tracker",
  description: "Track your skins and wishlist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white min-h-screen flex flex-col">
        <NextAuthProvider>
          <Header />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
