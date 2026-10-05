import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trik Sulap Kartu — Penjelasan Matematis",
  description: "Bagaimana temanmu tahu kartumu pasti 2♥? Penjelasan deterministik via teori himpunan & pemetaan linear. Game interaktif + treatise matematis.",
  keywords: ["sulap kartu", "set theory", "27-card trick", "deterministik", "matematika"],
  authors: [{ name: "AdamRizky1" }],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='90' font-size='90'%3E%E2%99%A0%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    title: "Trik Sulap Kartu Deterministik",
    description: "Game + penjelasan matematis tentang trik sulap kartu klasik",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
