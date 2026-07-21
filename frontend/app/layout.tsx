import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Security from "@/components/ui/Security";
import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";
import MonetagAds from "@/components/ads/MonetagAds";
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
    default: "Neocinema — Stream Free Movies & TV Series Online | No Sign Up",
    template: "%s | Neocinema"
  },
  description: "Explore Neocinema: search and stream free movies & TV series online. Use our advanced filter to select multiple genres, combine with ratings or release years, and sort precisely to find exactly what to watch with no sign up.",
  keywords: [
    "best free movie streaming sites no sign up required",
    "safe free movie streaming web apps no download",
    "free movies online high quality streaming",
    "filter movies by multiple genres",
    "select multiple genres movie search",
    "advanced movie search filter",
    "precise movie discovery sort",
    "best free alternatives to fmovies safely",
    "best neocinema streaming alternative",
    "free full movie streaming online",
    "watch series online free hd",
    "discover movies online free",
    "AI movie recommender free",
    "movies", "series", "streaming", "AI recommendations", "Neocinema", "NeocinemaTV", "movie discovery", "anime"
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Neocinema — Movies, Series & Anime Discovery",
    description: "Discover trending movies, TV series, and anime on Neocinema. AI-powered recommendations and a cinematic browsing experience.",
    url: '/',
    siteName: "Neocinema",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og_banner.png", width: 1200, height: 630, alt: "Neocinema — Discover Movies & Series" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neocinema — Movies, Series & Anime Discovery",
    description: "Discover trending movies, TV series, and anime with AI-powered recommendations on Neocinema.",
    images: ["/og_banner.png"],
    creator: "@neocinematv",
  },
  verification: {
    google: ["II4VqINTxDD9hlZqBSTqyO7vBQApjT92YCHylPQflfg", "eA4ZNRp53PMpPh1NyjoV3fo_kJi-rv_9ISEl0gH8KMo"],
    yandex: "50ea89eefcbf151d",
    other: {
      monetag: "7bdf3366d833c7c08b7f5695cf6ae3d9",
    },
  },
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
        "legalName": "Neocinema",
        "description": "AI-powered cinematic movie and series discovery platform with semantic search and personalized recommendations.",
        "foundingDate": "2025",
        "founders": [
          {
            "@type": "Person",
            "name": "Love Ghariwala",
          },
        ],
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
        "description": "One of the best free movie streaming sites no sign up required. Safe free movie streaming web apps no download with high quality.",
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
        "name": "Neocinema",
        "url": baseUrl,
        "description": "A platform for discovering movies, TV series, and anime with AI-powered semantic recommendations, advanced filtering, and personalized watchlists.",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "publisher": { "@id": `${baseUrl}#org` },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "category": "free"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1280",
          "bestRating": "5"
        },
        "featureList": [
          "AI-powered movie recommendations",
          "Semantic search with vector embeddings",
          "Multi-genre combination search and precise filtering",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4RGXPG1KWQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4RGXPG1KWQ');
          `}
        </Script>

        {/* Ahrefs Webmaster Tools Analytics */}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="+kc1zXGQ8NqACPuHJIlgsw" strategy="afterInteractive" />
        {/* Global Ad Network Scripts */}
        {/* <AdsterraSocialBar /> */}
        {/* <MonetagAds /> */}
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-row bg-background">
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div className="flex-grow flex flex-col min-w-0">
          <Security />
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