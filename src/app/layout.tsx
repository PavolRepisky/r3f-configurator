import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

// Sci-fi header font
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-conthrax", // We map it to the variable we used in Tailwind/CSS
  display: "swap",
});

// Clean body font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terrabox Configurator",
  description: "Modular 3D Product Configurator built with R3F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased bg-black overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
