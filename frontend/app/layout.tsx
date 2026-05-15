import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import Footer from "@/components/footer/Footer";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoCinema — Full AI Movie & Series Platform",
  description: "Experience the future of cinematic discovery with NeoCinema. AI-powered recommendations, semantic search, and an ultra-dark cinematic experience.",
  keywords: ["movies", "series", "streaming", "AI recommendations", "NeoCinema", "cinematic platform"],
  authors: [{ name: "NeoCinema Team" }],
  openGraph: {
    title: "NeoCinema — Full AI Movie & Series Platform",
    description: "AI-powered cinematic movie and series discovery platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-row bg-background">
        <Sidebar />
        <div className="flex-grow flex flex-col min-w-0 lg:pl-24">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
