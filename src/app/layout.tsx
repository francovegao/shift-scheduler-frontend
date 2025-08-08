import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts'
import "./globals.css";

export const metadata: Metadata = {
  title: "Relief Pharmacist Scheduler",
  description: "Rleif Pharmacist Scheduler Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
