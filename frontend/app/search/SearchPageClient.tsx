"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MovieCard from "@/components/cards/MovieCard";
import { searchContent } from "@/lib/api-client";
import { Film, Flame, Loader2, Search, Sparkles, TrendingUp, Tv, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TYPE_FILTERS = [
    { label: "All", value: "", icon: null },
    { label: "Movies", value: "movie", icon: Film },
    { label: "Series", value: "tv", icon: Tv },
];

const QUICK_DISCOVERY_TAGS = [
    "Action", "Sci-Fi", "Hindi Dubbed", "Kdrama", "Horror", "Comedy", "Anime", "Thriller", "Marvel", "Romance"
];

const EMPTY_RESULTS = { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };

interface SearchPageClientProps {
    initialTrending: any[];
}

/** Reads q/type/page from the URL, falling back to defaults for invalid values. */
function readSearchState(params: URLSearchParams) {
    const rawType = params.get("type") || "";
    const rawPage = Number(params.get("page"));
    return {
        query: params.get("q") || "",
        type: rawType === "movie" || rawType === "tv" ? rawType : "",
        page: Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= 500 ? rawPage : 1,
    };
}

// The page is statically rendered, so the query comes from the URL on the client
// and results are fetched from the cached /api/search route.
export default function SearchPageClient({
    initialTrending,
}: SearchPageClientProps) {
    const searchParams = useSearchParams();
    const urlState = readSearchState(searchParams);

    const [query, setQuery] = useState(urlState.query);
    const [type, setType] = useState(urlState.type);
    const [page, setPage] = useState(urlState.page);
    const [data, setData] = useState<any>(EMPTY_RESULTS);
    const [isLoading, setIsLoading] = useState(urlState.query.trim().length >= 2);

    // The URL is only rewritten after the user types, so opening /search?q=...
    // never strips the query. lastPushedUrl tells our own pushes apart from
    // outside navigation (back/forward, the navbar search).
    const hasEditedQuery = useRef(false);
    const lastPushedUrl = useRef(searchParams.toString());

    const router = useRouter();
    const pathname = usePathname();
    const trending = initialTrending;

    // Adopt the URL when it changes from outside this component
    const searchParamsKey = searchParams.toString();
    useEffect(() => {
        if (searchParamsKey === lastPushedUrl.current) return;
        lastPushedUrl.current = searchParamsKey;
        const next = readSearchState(new URLSearchParams(searchParamsKey));
        hasEditedQuery.current = false;
        setQuery(next.query);
        setType(next.type);
        setPage(next.page);
    }, [searchParamsKey]);

    // Fetch data when the query, type or page changes (including the first load)
    useEffect(() => {
        if (query.trim().length < 2) {
            setData(EMPTY_RESULTS);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        let cancelled = false;
        const timer = setTimeout(async () => {
            try {
                const newData = await searchContent(query, type, page);
                if (!cancelled && newData) setData(newData);
            } catch (e) {
                console.error("Failed to fetch search data:", e);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }, hasEditedQuery.current ? 350 : 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query, type, page]);

    const updateUrl = useCallback((newQuery: string, newType: string, newPage: number) => {
        const params = new URLSearchParams();
        if (newQuery.trim().length >= 2) {
            params.set("q", newQuery.trim());
            if (newType) params.set("type", newType);
            if (newPage > 1) params.set("page", String(newPage));
        }
        lastPushedUrl.current = params.toString();
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(newUrl, { scroll: false });
    }, [pathname, router]);

    // Debounced URL sync while typing
    useEffect(() => {
        if (!hasEditedQuery.current) return;
        const timer = setTimeout(() => {
            const urlQ = new URLSearchParams(window.location.search).get("q") || "";
            if (query.trim() !== urlQ.trim()) {
                updateUrl(query, type, 1);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query, type, updateUrl]);

    const changePage = (p: number) => {
        setIsLoading(true);
        setPage(p);
        updateUrl(query, type, p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleTypeChange = (newType: string) => {
        setIsLoading(true);
        setType(newType);
        setPage(1);
        updateUrl(query, newType, 1);
    };

    const handleClear = () => {
        setIsLoading(false);
        setQuery("");
        setPage(1);
        updateUrl("", type, 1);
    };

    const handleTagClick = (tag: string) => {
        setIsLoading(true);
        setQuery(tag);
        setPage(1);
        updateUrl(tag, type, 1);
    };

    const hasResults = data.results && data.results.length > 0;
    const isSearching = query.trim().length >= 2;

    return (
        <main className="min-h-screen pb-24 pt-28 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* ─── Search Hero Header ───────────────────────────────────── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 shadow-lg shadow-red-950/50">
                            <Search size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                                Global <span className="text-red-500">Discovery</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1 flex items-center gap-2">
                                <Sparkles size={14} className="text-red-500" />
                                Search across thousands of movies, TV series, actors and genres
                            </p>
                        </div>
                    </div>

                    {/* ─── Search Bar ─────────────────────────────────── */}
                    <div className="relative max-w-3xl">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/90 px-5 py-4 backdrop-blur-2xl transition-all focus-within:border-red-500/60 focus-within:shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                            <Search
                                size={22}
                                className={`transition-colors ${isSearching ? "text-red-500" : "text-neutral-500"}`}
                            />
                            <input
                                type="text"
                                placeholder="Search movies, series, actors (e.g., Avatar, Spider-Man)..."
                                value={query}
                                onChange={(e) => {
                                    hasEditedQuery.current = true;
                                    setQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full bg-transparent text-sm sm:text-base font-medium text-white outline-none placeholder:text-neutral-500"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={handleClear}
                                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                                    aria-label="Clear search"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Hint */}
                        {query.length > 0 && query.length < 2 && (
                            <div className="mt-2 px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    Type at least 2 characters...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ─── Quick Discovery Genre Chips ─────────────────────── */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                            <Flame size={13} className="text-red-500" />
                            Popular Search Tags:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_DISCOVERY_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 touch-manipulation ${query.toLowerCase() === tag.toLowerCase()
                                            ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-900/40"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Type Filter Bar ──────────────────────────────── */}
                    {isSearching && (
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-widest text-neutral-400 mr-1">
                                    Filter:
                                </span>
                                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
                                    {TYPE_FILTERS.map((tf) => (
                                        <button
                                            key={tf.value}
                                            onClick={() => handleTypeChange(tf.value)}
                                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-black uppercase transition-all cursor-pointer ${type === tf.value
                                                    ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                                                    : "text-neutral-400 hover:text-white"
                                                }`}
                                        >
                                            {tf.icon && <tf.icon size={13} />}
                                            {tf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <span className="text-xs text-neutral-400 font-medium">
                                Found <strong className="text-white font-black">{data.totalResults?.toLocaleString("en-US")}</strong> titles
                            </span>
                        </div>
                    )}
                </div>

                {/* ─── Results ───────────────────────────────────────────── */}
                {isSearching ? (
                    isLoading ? (
                        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 backdrop-blur-sm animate-pulse"
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-800/60" />
                                    <div className="h-4 w-3/4 rounded-md bg-neutral-800/80" />
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-3 w-10 rounded bg-neutral-800/50" />
                                        <div className="h-3 w-12 rounded bg-neutral-800/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hasResults ? (
                        <>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {data.results.map((item: any, i: number) => (
                                    <div
                                        key={`${item.tmdbId}-${i}`}
                                    >
                                        <MovieCard movie={item} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => changePage(page - 1)}
                                        disabled={page <= 1}
                                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:opacity-30 cursor-pointer"
                                    >
                                        Prev
                                    </button>
                                    {generatePageNumbers(page, data.totalPages).map((p, i) =>
                                        p === "..." ? (
                                            <span key={`e-${i}`} className="px-1 text-neutral-600">⋯</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => changePage(p as number)}
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${page === p
                                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                        : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => changePage(page + 1)}
                                        disabled={page >= data.totalPages}
                                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:opacity-30 cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] text-center backdrop-blur-xl">
                            <Search size={32} className="mb-3 text-neutral-600" />
                            <h3 className="text-xl font-bold text-white">No results found</h3>
                            <p className="text-neutral-500">Try different keywords or filters</p>
                        </div>
                    )
                ) : (
                    /* ─── Trending (Empty State) ──────────────────────── */
                    <div
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <TrendingUp size={20} className="text-red-600" />
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                Trending This Week
                            </h2>
                        </div>
                        {trending.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {trending.map((item: any, i: number) => (
                                    <div
                                        key={item.tmdbId}
                                    >
                                        <MovieCard movie={item} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
    const capped = Math.min(total, 500);
    if (capped <= 7) return Array.from({ length: capped }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(capped - 1, current + 1); i++) pages.push(i);
    if (current < capped - 2) pages.push("...");
    pages.push(capped);
    return pages;
}
