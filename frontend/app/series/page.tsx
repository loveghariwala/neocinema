import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";

export const metadata: Metadata = {
    title: "Series — NeoCinema",
    description:
        "Browse over 200K TV series from every country. Filter by genre, year, rating, language. AI-powered discovery.",
};

export default function SeriesPage() {
    return (
        <BrowsePageClient
            type="tv"
            title="Browse Series"
            subtitle="200K+ series from every country — filter, sort, discover"
        />
    );
}
