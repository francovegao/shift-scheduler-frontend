import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts'
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Shift Happens",
  description: "Relief Pharmacist Scheduler Web App",
};

const poppins = Poppins({
      subsets: ['latin'],
      display: 'swap', 
      variable: '--font-poppins', //Css variable
      weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] 
    });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        {children} <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
