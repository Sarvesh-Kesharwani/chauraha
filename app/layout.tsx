import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { DriveSyncBridge } from "@/components/DriveSyncBridge";
import { SessionProviders } from "@/components/SessionProviders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "ChowkCraft - Desi City Builder",
  description: "Build Indian-style city maps with roads, chowks, flyovers, homes, markets, and landmarks.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <SessionProviders>
          <DriveSyncBridge />
          {children}
        </SessionProviders>
      </body>
    </html>
  );
}
