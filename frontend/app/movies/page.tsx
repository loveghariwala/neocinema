import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Movies — NeoCinema",
    description:
        "Browse over 1 million movies from every country. Filter by genre, year, rating, language. AI-powered discovery.",
};

export default function MoviesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            </div>
        }>
            <BrowsePageClient
                type="movie"
                title="Browse Movies"
                subtitle="1M+ movies from every country — filter, sort, discover"
            />
        </Suspense>
    );
}
