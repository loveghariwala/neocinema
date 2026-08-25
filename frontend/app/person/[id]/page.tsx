import { getPersonDetails } from "@/services/movieService";
import PersonPageClient from "./PersonPageClient";

import { Metadata } from "next";

export const revalidate = 5184000; // 2 months (60 days) - maximum Edge CDN caching

export async function generateStaticParams() {
    return [
        { id: "1136406" },
        { id: "1892" },
    ];
}

interface PersonPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
    const { id } = await params;
    const data = await getPersonDetails(id);
    
    if (!data || !data.person) {
        return {
            title: "Cast Member Not Found — Neocinema",
            description: "The cast member details page you are trying to reach does not exist or has been removed.",
            robots: { index: false, follow: false }
        };
    }
    
    const titleText = `${data.person.name} Movies and TV Shows`;
    const descriptionText = data.person.biography 
        ? `Find all movies and TV shows starring ${data.person.name}. ${data.person.biography.substring(0, 120)}...` 
        : `Discover the full list of movies and TV shows starring ${data.person.name} on Neocinema.`;

    const knownForKeywords = (data.results || [])
        .slice(0, 5)
        .map((c: any) => c.title || c.name)
        .filter(Boolean);

    return {
        title: titleText,
        description: descriptionText,
        keywords: [
            data.person.name,
            `${data.person.name} movies and tv shows`,
            `tv shows with ${data.person.name}`,
            `${data.person.name} movies`,
            `${data.person.name} filmography`,
            `movies starring ${data.person.name}`,
            `${data.person.name} best movies`,
            ...knownForKeywords,
            "actor", "cast", "filmography",
        ],
        alternates: {
            canonical: `/person/${id}`,
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            url: `/person/${id}`,
            type: "profile",
            images: data.person.profilePath 
                ? [{ url: `https://image.tmdb.org/t/p/h632${data.person.profilePath}` }] 
                : [{ url: "/logo.png" }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            images: data.person.profilePath ? [`https://image.tmdb.org/t/p/h632${data.person.profilePath}`] : ["/logo.png"],
        }
    };
}

export default async function PersonPage({ params }: PersonPageProps) {
    const resolvedParams = await params;
    const data = await getPersonDetails(resolvedParams.id);
    
    if (!data || !data.person) return <PersonPageClient data={data} />;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    // ─── Person JSON-LD ──────────────────────────────────────────────────────
    const personJsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${baseUrl}/person/${resolvedParams.id}#person`,
        "name": data.person.name,
        "url": `${baseUrl}/person/${resolvedParams.id}`,
        "image": data.person.profilePath ? `https://image.tmdb.org/t/p/h632${data.person.profilePath}` : `${baseUrl}/logo.png`,
        "description": data.person.biography,
        "jobTitle": (data.person as any).knownForDepartment || "Actor",
        "birthDate": (data.person as any).birthday || undefined,
        "birthPlace": (data.person as any).placeOfBirth ? {
            "@type": "Place",
            "name": (data.person as any).placeOfBirth,
        } : undefined,
    };

    // ─── Breadcrumb JSON-LD ──────────────────────────────────────────────────
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Cast & Crew", "item": baseUrl },
            { "@type": "ListItem", "position": 3, "name": data.person.name, "item": `${baseUrl}/person/${resolvedParams.id}` },
        ],
    };

    return (
        <>
            <script
                id="json-ld-person"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                id="json-ld-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            <PersonPageClient data={data} />
        </>
    );
}
