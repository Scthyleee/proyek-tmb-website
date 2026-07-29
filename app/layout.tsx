import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/cinematic/SoundEngine";
import { CustomCursor } from "@/components/cinematic/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TMB Kelompok 11 — Proyek DED & TI Kantor Kecamatan Pahandut",
  description:
    "Portofolio digital interaktif dokumentasi proyek Desain Enginering Detail (DED) dan Teknologi Informasi (TI) Kantor Kecamatan Pahandut — TMB Batch 2, Kelompok 11.",
  keywords: [
    "TMB",
    "Kelompok 11",
    "DED",
    "Teknologi Informasi",
    "Kantor Kecamatan Pahandut",
    "Portofolio",
  ],
  authors: [{ name: "TMB Batch 2 - Kelompok 11" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${orbitron.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SoundProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
