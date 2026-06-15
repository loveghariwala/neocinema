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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://neocinematv.vercel.app"),
  title: {
    default: "NeoCinema | AI-Powered Movie & TV Series Discovery",
    template: "%s | NeoCinema"
  },
  description: "Experience the future of cinematic discovery with NeoCinema. AI-powered recommendations, semantic search, and an ultra-dark cinematic experience for movies and TV shows.",
  keywords: ["movies", "series", "streaming", "AI recommendations", "NeoCinema", "cinematic platform", "movie discovery", "TV shows"],
  authors: [{ name: "NeoCinema Team" }],
  creator: "NeoCinema Team",
  publisher: "NeoCinema",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "NeoCinema | AI-Powered Movie & TV Series Discovery",
    description: "Experience the future of cinematic discovery with NeoCinema. AI-powered recommendations, semantic search, and an ultra-dark cinematic experience.",
    url: '/',
    siteName: "NeoCinema",
    type: "website",
    images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "NeoCinema Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoCinema | AI-Powered Movie & TV Series Discovery",
    description: "Experience the future of cinematic discovery with NeoCinema. AI-powered recommendations, semantic search, and an ultra-dark cinematic experience.",
    images: ["/neocinema_logo.png"],
    creator: "@neocinema",
  },
  verification: {
    google: "JVmcLJM33BWsPNbH1zaa3BF_EbUiCy20KHEPKT_6GnM",
  },
  icons: {
    icon: "/neocinema_logo.png",
    shortcut: "/neocinema_logo.png",
    apple: "/neocinema_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://neocinematv.vercel.app";
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NeoCinema",
    "url": baseUrl,
    "logo": `${baseUrl}/neocinema_logo.png`,
    "description": "AI-powered cinematic movie and series discovery platform.",
    "sameAs": [
      "https://twitter.com/neocinema"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NeoCinema",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "NeoCinema Creator",
    "jobTitle": "Software Developer & Designer",
    "url": baseUrl,
    "worksFor": {
      "@type": "Organization",
      "name": "NeoCinema"
    }
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-row bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
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
