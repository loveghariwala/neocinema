import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
    title: "Discover — NeoCinema",
    description:
        "Search and discover over 1 million movies and 200K+ series from every country in the world.",
};

export default function SearchPage() {
    return <SearchPageClient />;
}