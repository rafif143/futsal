import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TournamentProvider } from "@/contexts/TournamentContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yadika Cup Futsal 2026",
  description: "Futsal Tournament Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <TournamentProvider>
          {children}
        </TournamentProvider>
      </body>
    </html>
  );
}
