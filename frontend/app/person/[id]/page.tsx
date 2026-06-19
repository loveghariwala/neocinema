import { getPersonDetails } from "@/services/movieService";
import PersonPageClient from "./PersonPageClient";
import { Metadata } from "next";

export const revalidate = 86400; // ISR: cache person detail pages for 24 hours

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
            title: "Cast Member Not Found — NeoCinema",
            description: "The cast member details page you are trying to reach does not exist or has been removed."
        };
    }
    
    const titleText = `${data.person.name} — NeoCinema`;
    const descriptionText = data.person.biography 
        ? `${data.person.biography.substring(0, 150)}...` 
        : `Discover movies and series starring ${data.person.name} on NeoCinema.`;

    const knownForKeywords = (data.results || [])
        .slice(0, 5)
        .map((c: any) => c.title || c.name)
        .filter(Boolean);

    return {
        title: titleText,
        description: descriptionText,
        keywords: [data.person.name, ...knownForKeywords, "actor", "cast", "filmography", "NeoCinema"],
        alternates: { canonical: `/person/${id}` },
        robots: { index: true, follow: true },
        openGraph: {
            title: titleText,
            description: descriptionText,
            type: "profile",
            images: data.person.profilePath 
                ? [{ url: `https://image.tmdb.org/t/p/h632${data.person.profilePath}` }] 
                : [{ url: "/neocinema_logo.png" }],
        },
        twitter: {
            card: "summary_large_image",
            title: titleText,
            description: descriptionText,
            images: data.person.profilePath ? [`https://image.tmdb.org/t/p/h632${data.person.profilePath}`] : ["/neocinema_logo.png"],
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
        "image": data.person.profilePath ? `https://image.tmdb.org/t/p/h632${data.person.profilePath}` : `${baseUrl}/neocinema_logo.png`,
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
