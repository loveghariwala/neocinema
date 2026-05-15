import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";

export const metadata: Metadata = {
    title: "Movies — NeoCinema",
    description:
        "Browse over 1 million movies from every country. Filter by genre, year, rating, language. AI-powered discovery.",
};

export default function MoviesPage() {
    return (
        <BrowsePageClient
            type="movie"
            title="Browse Movies"
            subtitle="1M+ movies from every country — filter, sort, discover"
        />
    );
}
