import { Metadata } from "next";
import VibeFinderClient from "@/components/vibe/VibeFinderClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    title: "AI Movie Vibe Finder — What to Watch Tonight Generator | NeoCinema",
    description: "Can't decide what movie to watch tonight on Netflix, Prime, or Hulu? Use our free AI Movie Vibe Finder to filter by mood, streaming service, and runtime for instant recommendations.",
    keywords: [
        "what to watch on netflix tonight",
        "movie vibe finder",
        "ai movie picker",
        "movie recommendation generator",
        "what movie should i watch",
        "ai movie finder",
        "what to watch tonight",
        "movie mood generator",
        "free streaming movie finder",
        "ai cinema recommendations"
    ],
    alternates: {
        canonical: `${baseUrl}/vibe-finder`,
    },
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
    openGraph: {
        title: "AI Movie Vibe Finder — What to Watch Tonight Generator | NeoCinema",
        description: "Pick your mood and let AI match your perfect movie or TV show in seconds. Filter by Netflix, Prime, Disney+, or free streaming.",
        url: `${baseUrl}/vibe-finder`,
        siteName: "NeoCinema",
        type: "website",
        images: [
            {
                url: `${baseUrl}/og_banner.png`,
                width: 1200,
                height: 630,
                alt: "AI Movie Vibe Finder - NeoCinema",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Movie Vibe Finder — What to Watch Tonight Generator | NeoCinema",
        description: "Pick your mood and let AI match your perfect movie or TV show in seconds.",
        images: [`${baseUrl}/og_banner.png`],
        creator: "@neocinematv",
    },
};

export default function VibeFinderPage() {
    const webAppJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Movie Vibe Finder",
        "url": `${baseUrl}/vibe-finder`,
        "description": "AI recommendation tool that filters movies and TV series by mood, streaming platform, and length.",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "publisher": {
            "@type": "Organization",
            "name": "NeoCinema",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl,
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "AI Movie Vibe Finder",
                "item": `${baseUrl}/vibe-finder`,
            },
        ],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does the AI Movie Vibe Finder work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI Vibe Finder filters over 10,000+ top-rated movies and TV series by mood, runtime, and streaming availability to instantly suggest titles matching your exact current vibe."
                }
            },
            {
                "@type": "Question",
                "name": "Can I filter by streaming services like Netflix, Prime, and Disney+?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can choose between Netflix, Amazon Prime Video, Disney+, Hulu, or free legal streaming providers like Tubi and Pluto TV."
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-black text-white pt-16 sm:pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
            />
            <VibeFinderClient />
        </main>
    );
}

