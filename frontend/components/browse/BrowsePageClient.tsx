"use client";

import { useState, useCallback, useEffect } from "react";
import BrowseFilterPanel, { FilterState } from "./BrowseFilterPanel";
import BrowseGrid from "./BrowseGrid";
import { Film, Tv, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    type: "movie" | "tv";
    title: string;
    subtitle: string;
}

interface BrowseData {
    results: any[];
    totalResults: number;
    totalPages: number;
    currentPage: number;
}

export default function BrowsePageClient({ type, title, subtitle }: Props) {
    const [data, setData] = useState<BrowseData>({
        results: [],
        totalResults: 0,
        totalPages: 1,
        currentPage: 1,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(
        async (filters: FilterState) => {
            setIsLoading(true);
            try {
                // If search is active, use the search endpoint
                if (filters.search && filters.search.trim().length >= 2) {
                    const params = new URLSearchParams({
                        query: filters.search,
                        page: String(filters.page || 1),
                        type: type,
                    });
                    const res = await fetch(`/api/search?${params.toString()}`);
                    if (res.ok) {
                        setData(await res.json());
                    }
                } else {
                    // Use discover endpoint with filters
                    const endpoint = type === "movie" ? "/api/discover/movies" : "/api/discover/series";
                    const params = new URLSearchParams();
                    params.set("page", String(filters.page || 1));
                    params.set("sort_by", filters.sortBy || "popularity.desc");

                    if (filters.genreIds?.length > 0) {
                        params.set("with_genres", filters.genreIds.join(","));
                    }
                    if (filters.yearFrom) params.set("year_from", String(filters.yearFrom));
                    if (filters.yearTo) params.set("year_to", String(filters.yearTo));
                    if (filters.ratingMin !== null && filters.ratingMin !== undefined) {
                        params.set("rating_min", String(filters.ratingMin));
                    }
                    if (filters.ratingMax !== null && filters.ratingMax !== undefined) {
                        params.set("rating_max", String(filters.ratingMax));
                    }
                    if (filters.language) params.set("language", filters.language);

                    const res = await fetch(`${endpoint}?${params.toString()}`);
                    if (res.ok) {
                        setData(await res.json());
                    }
                }
            } catch (err) {
                console.error("Browse fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [type]
    );

    // Initial load
    useEffect(() => {
        fetchData({
            genreIds: [],
            yearFrom: null,
            yearTo: null,
            ratingMin: null,
            ratingMax: null,
            sortBy: "popularity.desc",
            search: "",
            page: 1,
            language: "",
        });
    }, [fetchData]);

    return (
        <main className="min-h-screen px-6 pb-20 pt-28 md:px-16">
            {/* ─── Page Header ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="rounded-2xl bg-red-600/20 p-3 text-red-500">
                        {type === "movie" ? <Film size={28} /> : <Tv size={28} />}
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                            {title.split(" ")[0]}{" "}
                            <span className="text-red-600">{title.split(" ").slice(1).join(" ")}</span>
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1 flex items-center gap-2">
                            <Sparkles size={14} className="text-red-600" />
                            {subtitle}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ─── Filter Panel ──────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
            >
                <BrowseFilterPanel
                    type={type}
                    onFilterChange={fetchData}
                    totalResults={data.totalResults}
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                />
            </motion.div>

            {/* ─── Results Grid ──────────────────────────────────────── */}
            <BrowseGrid
                movies={data.results}
                isLoading={isLoading}
                isMovie={type === "movie"}
            />
        </main>
    );
}
