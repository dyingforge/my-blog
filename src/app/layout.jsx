"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ThemeCom from "./components/ThemeCom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeModeScript } from "flowbite-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeModeScript />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="dark-mode"
            defaultTheme="dark"
            enableSystem={false}
          >
            <ThemeCom>
              <Header />
              {children}
            </ThemeCom>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
