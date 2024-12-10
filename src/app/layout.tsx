import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import { config } from "@/utils/constants/config";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "500"],
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-poppins",
  weight: "100 500",
});

export const metadata: Metadata = {
  title: config.application_name,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}



