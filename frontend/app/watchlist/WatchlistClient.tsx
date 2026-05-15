"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "@/components/cards/MovieCard";
import {
    Heart,
    Search,
    Trash2,
    Film,
    Tv,
    SlidersHorizontal,
    RotateCcw,
    X,
    Star,
} from "lucide-react";

const SORT_OPTIONS = [
    { label: "Date Added", value: "added", icon: "📅" },
    { label: "Title A-Z", value: "title", icon: "🔤" },
    { label: "Rating", value: "rating", icon: "⭐" },
    { label: "Year", value: "year", icon: "📆" },
];

const FILTER_TYPES = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
];

export default function WatchlistClient() {
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("added");
    const [filterType, setFilterType] = useState("all");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load watchlist from localStorage
    useEffect(() => {
        const load = () => {
            try {
                const stored = localStorage.getItem("neocinema-watchlist");
                if (stored) {
                    setWatchlist(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load watchlist:", e);
            }
            setIsLoaded(true);
        };

        load();
        window.addEventListener("watchlist-updated", load);
        return () => window.removeEventListener("watchlist-updated", load);
    }, []);

    // Save watchlist to localStorage
    const saveWatchlist = (newList: any[]) => {
        setWatchlist(newList);
        localStorage.setItem("neocinema-watchlist", JSON.stringify(newList));
    };

    const removeFromWatchlist = (movieId: string) => {
        const newList = watchlist.filter((m) => m._id !== movieId);
        saveWatchlist(newList);
    };

    const clearWatchlist = () => {
        saveWatchlist([]);
    };

    // Filter + Sort + Search
    const filteredAndSorted = useMemo(() => {
        let result = [...watchlist];

        // Type filter
        if (filterType === "movie") {
            result = result.filter((m) => m.isMovie !== false);
        } else if (filterType === "series") {
            result = result.filter((m) => m.isMovie === false);
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (m) =>
                    m.title?.toLowerCase().includes(q) ||
                    m.overview?.toLowerCase().includes(q) ||
                    m.genres?.some((g: string) => g.toLowerCase().includes(q))
            );
        }

        // Sort
        switch (sortBy) {
            case "title":
                result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                break;
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "year":
                result.sort((a, b) => {
                    const ya = a.releaseDate ? new Date(a.releaseDate).getFullYear() : 0;
                    const yb = b.releaseDate ? new Date(b.releaseDate).getFullYear() : 0;
                    return yb - ya;
                });
                break;
            case "added":
            default:
                // Reverse chronological (most recent first)
                result.reverse();
                break;
        }

        return result;
    }, [watchlist, search, sortBy, filterType]);

    // Pagination
    const LIMIT = 20;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(filteredAndSorted.length / LIMIT);
    const paginatedResults = filteredAndSorted.slice(
        (page - 1) * LIMIT,
        page * LIMIT
    );

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, sortBy, filterType]);

    if (!isLoaded) {
        return (
            <main className="min-h-screen px-6 pb-20 pt-28 md:px-16">
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-2 border-neutral-800" />
                        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-red-600" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-6 pb-20 pt-28 md:px-16">
            {/* ─── Header ──────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-red-600/20 p-3 text-red-500">
                            <Heart size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                                My <span className="text-red-600">Watchlist</span>
                            </h1>
                            <p className="text-neutral-500 font-medium mt-1">
                                {watchlist.length} title{watchlist.length !== 1 ? "s" : ""} saved
                            </p>
                        </div>
                    </div>

                    {watchlist.length > 0 && (
                        <button
                            onClick={clearWatchlist}
                            className="flex items-center gap-2 rounded-2xl border border-red-600/20 bg-red-600/5 px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-600/10 hover:border-red-600/30"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Clear All</span>
                        </button>
                    )}
                </div>
            </motion.div>

            {watchlist.length === 0 ? (
                /* ─── Empty State ─────────────────────────────────────────── */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] text-center backdrop-blur-xl"
                >
                    <div className="mb-6 rounded-full bg-neutral-800/50 p-6">
                        <Heart size={48} className="text-neutral-600" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">
                        Your watchlist is empty
                    </h3>
                    <p className="max-w-md text-neutral-500">
                        Start adding movies and series to your watchlist by clicking
                        the heart icon on any title.
                    </p>
                    <a
                        href="/movies"
                        className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-red-600/50"
                    >
                        Browse Movies
                    </a>
                </motion.div>
            ) : (
                <>
                    {/* ─── Filter / Sort / Search Bar ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                        {/* Search */}
                        <div className="relative flex-1 max-w-lg">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-xl transition-all focus-within:border-red-600/50 focus-within:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                                <Search size={18} className="text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Search your watchlist..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-600"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="text-neutral-500 transition-colors hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Type Filter */}
                            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                                {FILTER_TYPES.map((ft) => (
                                    <button
                                        key={ft.value}
                                        onClick={() => setFilterType(ft.value)}
                                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                            filterType === ft.value
                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                : "text-neutral-500 hover:text-white"
                                        }`}
                                    >
                                        {ft.value === "movie" && <Film size={12} />}
                                        {ft.value === "series" && <Tv size={12} />}
                                        {ft.label}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSortBy(opt.value)}
                                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                            sortBy === opt.value
                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                : "text-neutral-500 hover:text-white"
                                        }`}
                                        title={opt.label}
                                    >
                                        <span className="text-sm">{opt.icon}</span>
                                        <span className="hidden md:inline">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Results Info */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-500">
                            Showing{" "}
                            <span className="font-black text-white">
                                {filteredAndSorted.length}
                            </span>{" "}
                            title{filteredAndSorted.length !== 1 ? "s" : ""}
                            {search && (
                                <span className="text-neutral-600">
                                    {" "}matching &ldquo;
                                    <span className="text-red-500">{search}</span>&rdquo;
                                </span>
                            )}
                        </p>
                    </div>

                    {/* ─── Grid ────────────────────────────────────────────── */}
                    {paginatedResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <AnimatePresence mode="popLayout">
                                {paginatedResults.map((movie: any, index: number) => (
                                    <motion.div
                                        key={movie._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group relative"
                                    >
                                        <MovieCard movie={movie} />
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeFromWatchlist(movie._id);
                                            }}
                                            className="absolute -right-2 -top-2 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-700"
                                            title="Remove from watchlist"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex h-[30vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] text-center">
                            <Search size={32} className="mb-3 text-neutral-600" />
                            <h3 className="text-lg font-bold text-white">
                                No matches in your watchlist
                            </h3>
                            <p className="text-sm text-neutral-500">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}

                    {/* ─── Pagination ──────────────────────────────────────── */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
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
                                onClick={() =>
                                    setPage(Math.min(totalPages, page + 1))
                                }
                                disabled={page >= totalPages}
                                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-neutral-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
