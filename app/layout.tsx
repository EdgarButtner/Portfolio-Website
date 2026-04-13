import type { Metadata } from "next";
import { Geist, Geist_Mono, Grape_Nuts, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grapeNuts = Grape_Nuts({
  variable: "--font-grape-nuts",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable} ${grapeNuts.variable} ${playfairDisplay.variable} ${quicksand.variable} font-body`}>
          {children}
        </div>
      </body>
    </html>
  );
}
