import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Series — NeoCinema",
    description:
        "Browse over 200K TV series from every country. Filter by genre, year, rating, language. AI-powered discovery.",
};

export default function SeriesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            </div>
        }>
            <BrowsePageClient
                type="tv"
                title="Browse Series"
                subtitle="200K+ series from every country — filter, sort, discover"
            />
        </Suspense>
    );
}
