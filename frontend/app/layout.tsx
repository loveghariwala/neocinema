import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import InstallAppBanner from "@/components/ui/InstallAppBanner";
import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";
import MonetagAds from "@/components/ads/MonetagAds";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";


const playfairDisplayHeading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com"),
  // Google truncates titles past ~60 characters and descriptions past ~155.
  title: {
    default: "Neocinema — Discover Movies, TV Series & Where to Watch",
    template: "%s | Neocinema"
  },
  description: "Find what to watch next. Browse trending movies, TV series & anime with trailers, full cast, ratings and where to stream — filter by genre, year & mood.",
  keywords: [
    "movie discovery platform",
    "TV series recommendations",
    "anime guide",
    "where to watch movies",
    "multi-genre movie filter",
    "movie trailers",
    "AI movie recommender",
    "movies", "series", "anime", "movie discovery", "Neocinema", "NeocinemaTV",
    "cast information", "movie ratings", "TV series recommendations",
    // New High-Traffic Long-Tail Keywords
    "what movie should I watch tonight",
    "movie finder by plot",
    "random movie roulette generator",
    "find movies by vibe and mood",
    "where to watch movies and series",
    "multi genre movie search filter",
    "advanced movie discovery platform",
    "watch free HD movie trailers",
    "best hidden gem movie recommendations",
    "top rated TV series to binge watch",
    "where to stream trending anime",
    "select multiple genres movie filter",
    "cast crew and streaming guide",
    "psychological thriller movie finder",
    "kdrama streaming guide",
    "latest movie release trailers 2026",
    "cast and crew information",
    "Neocinema",
    "trending movies 2026"
  ],
  authors: [{ name: "Love Ghariwala", url: "https://github.com/loveghariwala" }],
  creator: "Love Ghariwala",
  publisher: "Neocinema",
  applicationName: "Neocinema",
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
  // No `url` here: pages without their own openGraph would inherit it and every one
  // would claim to be the home page. Next falls back to no og:url, which is correct.
  openGraph: {
    title: "Neocinema — Movies, Series & Anime Discovery",
    description: "Discover trending movies, TV series, and anime on Neocinema, with trailers, cast and where to watch.",
    siteName: "Neocinema",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.neocinematv.com/og_banner.png", width: 1200, height: 630, alt: "Neocinema — Discover Movies & Series", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neocinema — Movies, Series & Anime Discovery",
    description: "Discover trending movies, TV series, and anime with AI-powered recommendations on Neocinema.",
    images: ["https://www.neocinematv.com/og_banner.png"],
    creator: "@neocinematv",
  },
  verification: {
    google: ["II4VqINTxDD9hlZqBSTqyO7vBQApjT92YCHylPQflfg", "eA4ZNRp53PMpPh1NyjoV3fo_kJi-rv_9ISEl0gH8KMo"],
    yandex: "50ea89eefcbf151d",
    other: {
      monetag: "7bdf3366d833c7c08b7f5695cf6ae3d9",
      "msvalidate.01": "A2BEC912DC153707D04CE47C0FF04C36",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
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
        "name": "Neocinema",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Movie and TV series discovery platform with trailers, cast information and where-to-watch guides.",
        "foundingDate": "2025",
        "founder": { "@id": `${baseUrl}#creator` },
        "sameAs": [
          "https://twitter.com/neocinematv",
          "https://github.com/loveghariwala"
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": "Neocinema",
        "alternateName": ["NeocinemaTV", "Neo Cinema"],
        "description": "Discover movies, TV series and anime with trailers, cast information and where-to-watch guides.",
        "inLanguage": "en",
        "publisher": { "@id": `${baseUrl}#org` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${baseUrl}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${baseUrl}#creator`,
        "name": "Love Ghariwala",
        "url": "https://github.com/loveghariwala",
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black text-white">
        {/* Google AdSense - Deferred to avoid render blocking */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9352593649328091"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* Google Analytics - Deferred for Core Web Vitals optimization */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4RGXPG1KWQ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4RGXPG1KWQ');
          `}
        </Script>

        {/* Ahrefs Webmaster Tools Analytics */}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="+kc1zXGQ8NqACPuHJIlgsw" strategy="lazyOnload" />
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div className="flex-grow flex flex-col min-w-0">
          <Navbar />
          {/* A div, not <main>: each page renders its own <main>, and nested mains are invalid */}
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <InstallAppBanner />
        </div>
        <AdsterraSocialBar />

      </body>
    </html>
  );
}