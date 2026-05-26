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
    return <PersonPageClient data={data} />;
}
