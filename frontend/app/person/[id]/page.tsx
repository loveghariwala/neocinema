import { getPersonDetails } from "@/services/movieService";
import PersonPageClient from "./PersonPageClient";
import { Metadata } from "next";

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

    return {
        title: titleText,
        description: descriptionText,
        alternates: { canonical: `/person/${id}` },
        openGraph: {
            title: titleText,
            description: descriptionText,
            images: data.person.profilePath 
                ? [{ url: `https://image.tmdb.org/t/p/h632${data.person.profilePath}` }] 
                : [{ url: "/neocinema_logo.png" }],
        }
    };
}

export default async function PersonPage({ params }: PersonPageProps) {
    const resolvedParams = await params;
    const data = await getPersonDetails(resolvedParams.id);
    
    if (!data || !data.person) return <PersonPageClient data={data} />;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://neocinematv.vercel.app";
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.person.name,
        "url": `${baseUrl}/person/${resolvedParams.id}`,
        "image": data.person.profilePath ? `https://image.tmdb.org/t/p/h632${data.person.profilePath}` : `${baseUrl}/neocinema_logo.png`,
        "description": data.person.biography,
        "jobTitle": (data.person as any).knownForDepartment || "Actor"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <PersonPageClient data={data} />
        </>
    );
}
