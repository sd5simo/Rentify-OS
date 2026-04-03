import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoFlex Admin — Gestion de Location",
  description: "Plateforme d'administration interne — AutoFlex Car Rental",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} font-sans bg-[#0d1117] text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
