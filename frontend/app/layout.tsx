import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/navbar/Navbar";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com"),
  title: {
    default: "Watch Free Movies & TV Shows Online in HD",
    template: "%s | Watch Free Movies Online"
  },
  description: "Watch and stream free movies and TV series online in HD. Find the latest trending movies, top-rated series, and new releases with zero ads.",
  keywords: ["movies", "series", "streaming", "AI recommendations", "NeoCinema", "cinematic platform", "movie discovery", "TV shows", "free movies", "watch movies online", "HD movies", "trending movies", "top rated series"],
  authors: [{ name: "Love Ghariwala", url: "https://github.com/loveghariwala" }],
  creator: "Love Ghariwala",
  publisher: "Watch Free Movies",
  applicationName: "Watch Free Movies Online",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Watch Free Movies & TV Shows Online in HD",
    description: "Watch and stream free movies and TV series online in HD. Find the latest trending movies, top-rated series, and new releases with zero ads.",
    url: '/',
    siteName: "Watch Movies Online Free",
    locale: "en_US",
    type: "website",
    images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "Watch Free Movies & TV Series Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Free Movies & TV Shows Online in HD",
    description: "Watch and stream free movies and TV series online in HD. Find the latest trending movies, top-rated series, and new releases with zero ads.",
    images: ["/neocinema_logo.png"],
    creator: "@neocinema",
  },
  verification: {
    google: "JVmcLJM33BWsPNbH1zaa3BF_EbUiCy20KHEPKT_6GnM",
  },
  icons: {
    icon: [
      { url: "/neocinema_logo.png" },
      { url: "/neocinema_logo.png", sizes: "16x16", type: "image/png" },
      { url: "/neocinema_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/neocinema_logo.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/neocinema_logo.png",
    apple: [{ url: "/neocinema_logo.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

  // Consolidated @graph JSON-LD (Google-preferred single block)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#org`,
        "name": "NeoCinema",
        "url": baseUrl,
        "logo": `${baseUrl}/neocinema_logo.png`,
        "legalName": "NeoCinema",
        "description": "AI-powered cinematic movie and series discovery platform with semantic search and personalized recommendations.",
        "foundingDate": "2025",
        "founders": [
          {
            "@type": "Person",
            "name": "Love Ghariwala",
          },
        ],
        "sameAs": [
          "https://twitter.com/neocinema",
          "https://github.com/loveghariwala"
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": "NeoCinema",
        "description": "Experience the future of cinematic discovery with NeoCinema. AI-powered recommendations, semantic search, and an ultra-dark cinematic experience for movies and TV shows.",
        "publisher": { "@id": `${baseUrl}#org` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}#app`,
        "name": "NeoCinema",
        "url": baseUrl,
        "description": "A platform for discovering movies, TV series, and anime with AI-powered semantic recommendations, advanced filtering, and personalized watchlists.",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "publisher": { "@id": `${baseUrl}#org` },
        "featureList": [
          "AI-powered movie recommendations",
          "Semantic search with vector embeddings",
          "Advanced genre, year, and rating filters",
          "Personalized watchlists",
          "Trending and top-rated discovery",
          "Cast and crew exploration",
          "Ultra-dark cinematic UI experience",
        ],
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}#creator`,
        "name": "Love Ghariwala",
        "jobTitle": "Full-Stack Developer & AI Engineer",
        "url": baseUrl,
        "worksFor": { "@id": `${baseUrl}#org` },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-row bg-background">
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div className="flex-grow flex flex-col min-w-0">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}