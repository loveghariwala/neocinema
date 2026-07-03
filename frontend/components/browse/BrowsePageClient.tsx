"use client";

import { useState, useCallback, useEffect, useMemo, useTransition } from "react";
import BrowseFilterPanel, { FilterState } from "./BrowseFilterPanel";
import BrowseGrid from "./BrowseGrid";
import Film from "lucide-react/dist/esm/icons/film";
import Tv from "lucide-react/dist/esm/icons/tv";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";


import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { discoverContentFromServer, searchContentFromServer } from "@/services/movieService";

interface Genre {
    id: number;
    name: string;
}

interface BrowseData {
    results: any[];
    totalResults: number;
    totalPages: number;
    currentPage: number;
}

interface Props {
    type: "movie" | "tv";
    title: string;
    subtitle: string;
    initialData: BrowseData;
    initialGenres: Genre[];
}

export default function BrowsePageClient({ type, title, subtitle, initialData, initialGenres }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [data, setData] = useState<BrowseData>(initialData);
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    const isLoading = isPending;

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

    // Fetch data when filters change
    useEffect(() => {
        const isDefault = 
            currentFilters.page === 1 && 
            currentFilters.sortBy === "popularity.desc" && 
            currentFilters.genreIds.length === 0 &&
            !currentFilters.yearFrom && !currentFilters.yearTo &&
            currentFilters.ratingMin === null && currentFilters.ratingMax === null &&
            !currentFilters.language && !currentFilters.search;

        if (isInitialMount.current && isDefault) {
            isInitialMount.current = false;
            return;
        }

        isInitialMount.current = false;

        startTransition(() => {
            const fetchNewData = async () => {
                let newData;
                if (currentFilters.search && currentFilters.search.trim().length >= 2) {
                    newData = await searchContentFromServer(currentFilters.search, type, String(currentFilters.page));
                } else {
                    const params: Record<string, string> = {
                        page: String(currentFilters.page),
                        sort_by: currentFilters.sortBy,
                    };
                    if (currentFilters.genreIds.length > 0) params.with_genres = currentFilters.genreIds.join(",");
                    if (currentFilters.yearFrom) params.year_from = String(currentFilters.yearFrom);
                    if (currentFilters.yearTo) params.year_to = String(currentFilters.yearTo);
                    if (currentFilters.ratingMin !== null) params.rating_min = String(currentFilters.ratingMin);
                    if (currentFilters.ratingMax !== null) params.rating_max = String(currentFilters.ratingMax);
                    if (currentFilters.language) params.language = currentFilters.language;

                    newData = await discoverContentFromServer(type, params);
                }
                
                if (newData) setData(newData);
            };
            fetchNewData();
        });
    }, [currentFilters, type]);

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

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }, [router, pathname]);

    const changePage = (p: number) => {
        const updatedFilters = { ...currentFilters, page: p };
        handleFilterChange(updatedFilters);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen px-6 pb-20 pt-28 md:px-16 relative">
            {/* Subtle Top Gradient Mesh */}
            <div className="pointer-events-none absolute left-0 top-0 h-[40vh] w-full bg-gradient-to-b from-red-900/10 via-background to-background" />
            <div className="pointer-events-none absolute left-1/4 top-0 h-[30vh] w-[50vw] rounded-full bg-red-600/5 blur-[120px]" />

            {/* ─── Page Header ─────────────────────────────────────────── */}
            <div
                className="relative mb-12"
            >
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600/20 to-black border border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                        {type === "movie" ? <Film size={32} /> : <Tv size={32} />}
                    </div>
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 drop-shadow-lg">
                            {title.split(" ")[0]}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-800">{title.split(" ").slice(1).join(" ")}</span>
                        </h1>
                        <p className="text-neutral-400 font-bold tracking-wide mt-2 flex items-center gap-2 text-sm sm:text-base">
                            <Sparkles size={16} className="text-red-500 animate-pulse" />
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Filter Panel ──────────────────────────────────────── */}
            <div
                className="mb-8"
            >
                <BrowseFilterPanel
                    type={type}
                    filters={currentFilters}
                    onFilterChange={handleFilterChange}
                    totalResults={data.totalResults}
                    genres={initialGenres}
                />
            </div>

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
