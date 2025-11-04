import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  Outfit,
  Roboto_Mono,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevQuery Forum - Get Instant AI-Powered Answers",
  description:
    "A modern Q&A platform where every question receives instant AI-generated answers, powered by GPT-5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bricolage.variable} ${outfit.variable} ${robotoMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main className="px-4 md:px-6 py-8">
            <div className="max-w-[1200px] mx-auto">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
