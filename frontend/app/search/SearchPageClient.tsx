"use client";

import { useState, useEffect, useCallback } from "react";
import MovieCard from "@/components/cards/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Film, Tv, Sparkles, X, Loader2, TrendingUp } from "lucide-react";

const TYPE_FILTERS = [
    { label: "All", value: "", icon: null },
    { label: "Movies", value: "movie", icon: Film },
    { label: "Series", value: "tv", icon: Tv },
];

export default function SearchPageClient() {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>({
        results: [],
        totalResults: 0,
        totalPages: 1,
        currentPage: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [trending, setTrending] = useState<any[]>([]);
    const [trendingLoaded, setTrendingLoaded] = useState(false);

    // Load trending for empty state
    useEffect(() => {
        async function loadTrending() {
            try {
                const res = await fetch("/api/trending/movie?time_window=week");
                if (res.ok) {
                    const d = await res.json();
                    setTrending(d.results || []);
                }
            } catch (e) {
                console.error(e);
            }
            setTrendingLoaded(true);
        }
        loadTrending();
    }, []);

    // Search
    const doSearch = useCallback(
        async (q: string, t: string, p: number) => {
            if (!q || q.trim().length < 2) return;
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    query: q.trim(),
                    page: String(p),
                });
                if (t) params.set("type", t);
                const res = await fetch(`/api/search?${params.toString()}`);
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (e) {
                console.error("Search error:", e);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Debounced search
    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setData({ results: [], totalResults: 0, totalPages: 1, currentPage: 1 });
            return;
        }
        const timer = setTimeout(() => {
            doSearch(query, type, 1);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [query, type, doSearch]);

    const changePage = (p: number) => {
        setPage(p);
        doSearch(query, type, p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const hasResults = data.results && data.results.length > 0;
    const isSearching = query.trim().length >= 2;

    return (
        <main className="min-h-screen px-6 pb-20 pt-28 md:px-16">
            {/* ─── Header ────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-2xl bg-red-600/20 p-3 text-red-500">
                        <Search size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                            Discover <span className="text-red-600">Everything</span>
                        </h1>
                        <p className="text-neutral-500 font-medium mt-1 flex items-center gap-2">
                            <Sparkles size={14} className="text-red-600" />
                            Search across 1M+ movies and 200K+ series from every country
                        </p>
                    </div>
                </div>

                {/* ─── Big Search Bar ────────────────────────────────── */}
                <div className="relative max-w-3xl">
                    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl transition-all focus-within:border-red-600/50 focus-within:shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                        <Search
                            size={24}
                            className={`transition-colors ${isSearching ? "text-red-600" : "text-neutral-500"}`}
                        />
                        <input
                            type="text"
                            placeholder="Search movies, series, actors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent text-lg font-medium text-white outline-none placeholder:text-neutral-600"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="text-neutral-500 transition-colors hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        )}
                        {isLoading && (
                            <Loader2 size={20} className="animate-spin text-red-600" />
                        )}
                    </div>

                    {/* Hint */}
                    {query.length > 0 && query.length < 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 px-2"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                                Type at least 2 characters...
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* ─── Type Filter ───────────────────────────────────── */}
                {isSearching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 flex items-center gap-3"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-neutral-600 mr-2">
                            Filter:
                        </span>
                        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                            {TYPE_FILTERS.map((tf) => (
                                <button
                                    key={tf.value}
                                    onClick={() => setType(tf.value)}
                                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                        type === tf.value
                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                            : "text-neutral-500 hover:text-white"
                                    }`}
                                >
                                    {tf.icon && <tf.icon size={14} />}
                                    {tf.label}
                                </button>
                            ))}
                        </div>

                        {isSearching && (
                            <span className="text-sm text-neutral-500 ml-4">
                                <span className="font-black text-white">{data.totalResults?.toLocaleString()}</span> results
                            </span>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* ─── Results ───────────────────────────────────────────── */}
            {isSearching ? (
                isLoading && !hasResults ? (
                    <div className="flex h-[40vh] flex-col items-center justify-center">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-2 border-neutral-800" />
                            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-red-600" />
                        </div>
                        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-neutral-600">
                            Searching globally...
                        </p>
                    </div>
                ) : hasResults ? (
                    <>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {data.results.map((item: any, i: number) => (
                                <motion.div
                                    key={`${item.tmdbId}-${i}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <MovieCard movie={item} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {data.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => changePage(page - 1)}
                                    disabled={page <= 1}
                                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:opacity-30"
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
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                                page === p
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
                                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:opacity-30"
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
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
                                <motion.div
                                    key={item.tmdbId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <MovieCard movie={item} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
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
