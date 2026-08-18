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
    ],
    alternates: {
        canonical: `${baseUrl}/vibe-finder`,
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "AI Movie Vibe Finder — What to Watch Tonight Generator | NeoCinema",
        description: "Pick your mood and let AI match your perfect movie or TV show in seconds.",
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
    },
};

export default function VibeFinderPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Movie Vibe Finder",
        "url": `${baseUrl}/vibe-finder`,
        "description": "AI recommendation tool that filters movies and TV series by mood, streaming platform, and length.",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "publisher": {
            "@type": "Organization",
            "name": "NeoCinema",
            "url": baseUrl,
        },
    };

    return (
        <main className="min-h-screen bg-black text-white pt-16 sm:pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <VibeFinderClient />
        </main>
    );
}
