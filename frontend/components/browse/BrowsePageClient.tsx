"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import BrowseFilterPanel, { FilterState } from "./BrowseFilterPanel";
import BrowseGrid from "./BrowseGrid";
import { Film, Tv, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [data, setData] = useState<BrowseData>({
        results: [],
        totalResults: 0,
        totalPages: 1,
        currentPage: 1,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Compute currentFilters directly from URL searchParams
    const currentFilters = useMemo<FilterState>(() => {
        const genre = searchParams.get("genre");
        const yearFrom = searchParams.get("yearFrom");
        const yearTo = searchParams.get("yearTo");
        const ratingMin = searchParams.get("ratingMin");
        const ratingMax = searchParams.get("ratingMax");
        const sortBy = searchParams.get("sort") || "popularity.desc";
        const search = searchParams.get("search") || "";
        const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
        const language = searchParams.get("language") || "";

        return {
            genreIds: genre ? genre.split(",").map(id => parseInt(id)) : [],
            yearFrom: yearFrom ? parseInt(yearFrom) : null,
            yearTo: yearTo ? parseInt(yearTo) : null,
            ratingMin: ratingMin ? parseFloat(ratingMin) : null,
            ratingMax: ratingMax ? parseFloat(ratingMax) : null,
            sortBy,
            search,
            page,
            language,
        };
    }, [searchParams]);

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

    // Sync all filter changes to the URL query string
    const handleFilterChange = useCallback((filters: FilterState) => {
        const params = new URLSearchParams();
        if (filters.genreIds.length > 0) params.set("genre", filters.genreIds.join(","));
        if (filters.yearFrom) params.set("yearFrom", String(filters.yearFrom));
        if (filters.yearTo) params.set("yearTo", String(filters.yearTo));
        if (filters.ratingMin !== null && filters.ratingMin !== undefined) params.set("ratingMin", String(filters.ratingMin));
        if (filters.ratingMax !== null && filters.ratingMax !== undefined) params.set("ratingMax", String(filters.ratingMax));
        if (filters.sortBy && filters.sortBy !== "popularity.desc") params.set("sort", filters.sortBy);
        if (filters.search) params.set("search", filters.search);
        if (filters.page && filters.page > 1) params.set("page", String(filters.page));
        if (filters.language) params.set("language", filters.language);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname]);

    const changePage = (p: number) => {
        const updatedFilters = { ...currentFilters, page: p };
        handleFilterChange(updatedFilters);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Fetch data whenever currentFilters (synced from URL query parameters) changes
    useEffect(() => {
        fetchData(currentFilters);
    }, [fetchData, currentFilters]);

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
                    filters={currentFilters}
                    onFilterChange={handleFilterChange}
                    totalResults={data.totalResults}
                />
            </motion.div>

            {/* ─── Results Grid ──────────────────────────────────────── */}
            <BrowseGrid
                movies={data.results}
                isLoading={isLoading}
                isMovie={type === "movie"}
            />

            {/* Bottom Pagination */}
            {data.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                    <button
                        onClick={() => changePage(data.currentPage - 1)}
                        disabled={data.currentPage <= 1}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    {generatePageNumbers(data.currentPage, data.totalPages).map((p, i) =>
                        p === "..." ? (
                            <span key={`e-${i}`} className="px-1 text-neutral-600">⋯</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => changePage(p as number)}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                    data.currentPage === p
                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30 font-black"
                                        : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => changePage(data.currentPage + 1)}
                        disabled={data.currentPage >= data.totalPages}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
    const capped = Math.min(total, 500);
    if (capped <= 7) return Array.from({ length: capped }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(capped - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < capped - 2) pages.push("...");
    pages.push(capped);
    return pages;
}
