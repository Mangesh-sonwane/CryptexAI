import React from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import Providers from "@/context/Providers";
import Navbar from "./Components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "CryptexAI",
  description:
    "Your ultimate AI-powered crypto insights and market tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <>
              <Navbar />
              <main className="background-light850_dark100 relative">
                {children}
              </main>
            </>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
