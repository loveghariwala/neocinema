import { getPersonDetails } from "@/services/movieService";
import PersonPageClient from "./PersonPageClient";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import { SITE_URL, TMDB_IMG, truncate, jsonLd } from "@/lib/seo";

// No `revalidate` — the static-assets cache is read-only; data is refreshed by the daily cron rebuild.

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
            title: "Cast Member Not Found",
            description: "The cast member details page you are trying to reach does not exist or has been removed.",
            robots: { index: false, follow: false }
        };
    }

    const knownForKeywords = (data.results || [])
        .slice(0, 5)
        .map((c: any) => c.title || c.name)
        .filter(Boolean);

    const titleText = `${data.person.name} Movies and TV Shows`;
    const knownFor = knownForKeywords.slice(0, 3).join(", ");
    const descriptionText = truncate(
        `${data.person.name} filmography: every movie and TV show${knownFor ? `, including ${knownFor}` : ""}. ${data.person.biography || `Browse the full list of titles starring ${data.person.name} on Neocinema.`}`
    );

    const baseUrl = SITE_URL;
    const canonicalUrl = `${baseUrl}/person/${id}`;

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
            canonical: canonicalUrl,
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            url: canonicalUrl,
            type: "profile",
            images: data.person.profilePath
                ? [{ url: `${TMDB_IMG}/h632${data.person.profilePath}`, width: 421, height: 632, alt: data.person.name }]
                : [{ url: "/og_banner.png", width: 1200, height: 630 }],
        },
        twitter: {
            // Profile photos are portrait; the large card would crop the face
            card: data.person.profilePath ? "summary" : "summary_large_image",
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            images: data.person.profilePath ? [`${TMDB_IMG}/h632${data.person.profilePath}`] : ["/og_banner.png"],
        }
    };
}

export default async function PersonPage({ params }: PersonPageProps) {
    const resolvedParams = await params;
    const data = await getPersonDetails(resolvedParams.id);
    
    if (!data || !data.person) notFound();

    const baseUrl = SITE_URL;
    const pageUrl = `${baseUrl}/person/${resolvedParams.id}`;
    const person = data.person;

    // ProfilePage is the type Google documents for a page about one person.
    const pageJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfilePage",
                "@id": `${pageUrl}#webpage`,
                "url": pageUrl,
                "name": `${person.name} Movies and TV Shows`,
                "isPartOf": { "@id": `${baseUrl}#website` },
                "mainEntity": { "@id": `${pageUrl}#person` },
                // ListItem without an `item` URL is only valid as the last crumb
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
                        { "@type": "ListItem", "position": 2, "name": person.name, "item": pageUrl },
                    ],
                },
            },
            {
                "@type": "Person",
                "@id": `${pageUrl}#person`,
                "name": person.name,
                "url": pageUrl,
                "image": person.profilePath ? `${TMDB_IMG}/h632${person.profilePath}` : undefined,
                "description": person.biography ? truncate(person.biography, 500) : undefined,
                "jobTitle": person.knownForDepartment === "Acting" ? "Actor" : person.knownForDepartment || undefined,
                "birthDate": person.birthday,
                "deathDate": person.deathday,
                "birthPlace": person.placeOfBirth ? { "@type": "Place", "name": person.placeOfBirth } : undefined,
                "sameAs": [
                    person.imdbId && `https://www.imdb.com/name/${person.imdbId}/`,
                    `https://www.themoviedb.org/person/${person.id}`,
                ].filter(Boolean),
            },
        ],
    };

    return (
        <>
            <script
                id="json-ld-person"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd(pageJsonLd) }}
            />
            <PersonPageClient data={data} />
        </>
    );
}
