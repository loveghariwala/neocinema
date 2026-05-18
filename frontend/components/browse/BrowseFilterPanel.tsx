"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Sparkles,
    Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Genre {
    id: number;
    name: string;
}

export interface FilterState {
    genreIds: number[];
    yearFrom: number | null;
    yearTo: number | null;
    ratingMin: number | null;
    ratingMax: number | null;
    sortBy: string;
    search: string;
    page: number;
    language: string;
}

interface Props {
    type: "movie" | "tv";
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    totalResults: number;
}

const SORT_OPTIONS = [
    { label: "Most Popular", value: "popularity.desc", icon: "🔥" },
    { label: "Top Rated", value: "vote_average.desc", icon: "⭐" },
    { label: "Newest", value: "primary_release_date.desc", icon: "🆕" },
    { label: "Oldest", value: "primary_release_date.asc", icon: "📜" },
    { label: "Revenue", value: "revenue.desc", icon: "💰" },
];

const LANGUAGES = [
    { code: "", label: "All Languages" },
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ko", label: "Korean" },
    { code: "ja", label: "Japanese" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "zh", label: "Chinese" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
    { code: "ml", label: "Malayalam" },
    { code: "th", label: "Thai" },
    { code: "tr", label: "Turkish" },
    { code: "ru", label: "Russian" },
    { code: "it", label: "Italian" },
    { code: "pt", label: "Portuguese" },
    { code: "ar", label: "Arabic" },
    { code: "tl", label: "Filipino" },
];

export default function BrowseFilterPanel({
    type,
    filters,
    onFilterChange,
    totalResults,
}: Props) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search);

    // Sync input box value if filters.search changes from outside (e.g., reset button)
    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    // Fetch genres from AI service
    useEffect(() => {
        async function fetchGenres() {
            try {
                const res = await fetch(`/api/genres/${type}`);
                if (res.ok) {
                    const data = await res.json();
                    setGenres(data.genres || []);
                }
            } catch (err) {
                console.error("Failed to fetch genres:", err);
            }
        }
        fetchGenres();
    }, [type]);

    // Debounced search - this is the IN-PAGE search, separate from navbar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== filters.search) {
                onFilterChange({ ...filters, search: searchInput, page: 1 });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, filters, onFilterChange]);

    const updateFilter = useCallback(
        (updates: Partial<FilterState>) => {
            const newFilters = { ...filters, ...updates, page: 1 };
            onFilterChange(newFilters);
        },
        [filters, onFilterChange]
    );

    const toggleGenre = (genreId: number) => {
        const newIds = filters.genreIds.includes(genreId)
            ? filters.genreIds.filter((id) => id !== genreId)
            : [...filters.genreIds, genreId];
        updateFilter({ genreIds: newIds });
    };

    const resetFilters = () => {
        const reset: FilterState = {
            genreIds: [],
            yearFrom: null,
            yearTo: null,
            ratingMin: null,
            ratingMax: null,
            sortBy: "popularity.desc",
            search: "",
            page: 1,
            language: "",
        };
        setSearchInput("");
        onFilterChange(reset);
    };



    const hasActiveFilters =
        filters.genreIds.length > 0 ||
        filters.yearFrom !== null ||
        filters.yearTo !== null ||
        filters.ratingMin !== null ||
        filters.ratingMax !== null ||
        filters.search !== "" ||
        filters.language !== "";

    // Year options
    const currentYear = new Date().getFullYear();
    const yearOptions: number[] = [];
    for (let y = currentYear + 1; y >= 1900; y--) yearOptions.push(y);

    return (
        <div className="space-y-6">
            {/* ─── TOP BAR ────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* In-page Search (different from navbar) */}
                <div className="relative flex-1 max-w-lg">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-xl transition-all focus-within:border-red-600/50 focus-within:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                        <Search size={18} className="text-neutral-500" />
                        <input
                            type="text"
                            placeholder={`Search ${type === "movie" ? "movies" : "series"} by title...`}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-600"
                        />
                        {searchInput && (
                            <button
                                onClick={() => { setSearchInput(""); updateFilter({ search: "" }); }}
                                className="text-neutral-500 transition-colors hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Sort Selector */}
                    <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl">
                        {SORT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => updateFilter({ sortBy: opt.value })}
                                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                    filters.sortBy === opt.value
                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                        : "text-neutral-500 hover:bg-white/5 hover:text-white"
                                }`}
                                title={opt.label}
                            >
                                <span className="text-sm">{opt.icon}</span>
                                <span className="hidden md:inline">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`relative flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-all ${
                            isFilterOpen
                                ? "border-red-600/50 bg-red-600/10 text-red-500"
                                : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-white"
                        }`}
                    >
                        <SlidersHorizontal size={16} />
                        <span className="hidden sm:inline">Filters</span>
                        {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {hasActiveFilters && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white">
                                {filters.genreIds.length +
                                    (filters.yearFrom ? 1 : 0) +
                                    (filters.yearTo ? 1 : 0) +
                                    (filters.ratingMin !== null ? 1 : 0) +
                                    (filters.language ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={resetFilters}
                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-neutral-400 transition-all hover:border-red-600/30 hover:text-red-500"
                        >
                            <RotateCcw size={14} />
                            <span className="hidden sm:inline">Reset</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* ─── EXPANDABLE FILTER PANEL ────────────────────────────────── */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600">
                                <Sparkles size={14} className="text-red-600" />
                                <span>Advanced Filters — Every Country, Every Language</span>
                            </div>

                            {/* Genre Multi-Select */}
                            <div>
                                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-neutral-500">
                                    Genres
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            onClick={() => toggleGenre(genre.id)}
                                            className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                                                filters.genreIds.includes(genre.id)
                                                    ? "border-red-600 bg-red-600/20 text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.2)]"
                                                    : "border-white/10 bg-white/[0.03] text-neutral-500 hover:border-white/20 hover:text-white"
                                            }`}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Range + Rating + Language */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Year Range */}
                                <div>
                                    <label className="mb-3 block text-xs font-black uppercase tracking-widest text-neutral-500">
                                        Release Year
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={filters.yearFrom ?? ""}
                                            onChange={(e) =>
                                                updateFilter({ yearFrom: e.target.value ? parseInt(e.target.value) : null })
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all focus:border-red-600/50 appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-neutral-900">From</option>
                                            {yearOptions.map((y) => (
                                                <option key={y} value={y} className="bg-neutral-900">{y}</option>
                                            ))}
                                        </select>
                                        <span className="text-neutral-600 font-bold">—</span>
                                        <select
                                            value={filters.yearTo ?? ""}
                                            onChange={(e) =>
                                                updateFilter({ yearTo: e.target.value ? parseInt(e.target.value) : null })
                                            }
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all focus:border-red-600/50 appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-neutral-900">To</option>
                                            {yearOptions.map((y) => (
                                                <option key={y} value={y} className="bg-neutral-900">{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Rating Range */}
                                <div>
                                    <label className="mb-3 block text-xs font-black uppercase tracking-widest text-neutral-500">
                                        Rating
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min={0}
                                            max={10}
                                            step={0.5}
                                            value={filters.ratingMin ?? ""}
                                            onChange={(e) =>
                                                updateFilter({ ratingMin: e.target.value ? parseFloat(e.target.value) : null })
                                            }
                                            placeholder="Min (0)"
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all focus:border-red-600/50 placeholder:text-neutral-600"
                                        />
                                        <span className="text-neutral-600 font-bold">—</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={10}
                                            step={0.5}
                                            value={filters.ratingMax ?? ""}
                                            onChange={(e) =>
                                                updateFilter({ ratingMax: e.target.value ? parseFloat(e.target.value) : null })
                                            }
                                            placeholder="Max (10)"
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all focus:border-red-600/50 placeholder:text-neutral-600"
                                        />
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="mb-3 block text-xs font-black uppercase tracking-widest text-neutral-500">
                                        <Globe size={12} className="inline mr-1" /> Language / Country
                                    </label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => updateFilter({ language: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none backdrop-blur-xl transition-all focus:border-red-600/50 appearance-none cursor-pointer"
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <option key={lang.code} value={lang.code} className="bg-neutral-900">
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Active Filters Tags */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mr-2">
                                        Active:
                                    </span>
                                    {filters.genreIds.map((gid) => {
                                        const genre = genres.find((g) => g.id === gid);
                                        return (
                                            <span
                                                key={gid}
                                                onClick={() => toggleGenre(gid)}
                                                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1 text-xs font-bold text-red-400 transition-all hover:bg-red-600/20"
                                            >
                                                {genre?.name || gid} <X size={10} />
                                            </span>
                                        );
                                    })}
                                    {filters.language && (
                                        <span
                                            onClick={() => updateFilter({ language: "" })}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 transition-all hover:bg-purple-500/20"
                                        >
                                            {LANGUAGES.find((l) => l.code === filters.language)?.label} <X size={10} />
                                        </span>
                                    )}
                                    {filters.yearFrom && (
                                        <span
                                            onClick={() => updateFilter({ yearFrom: null })}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 transition-all hover:bg-blue-500/20"
                                        >
                                            From {filters.yearFrom} <X size={10} />
                                        </span>
                                    )}
                                    {filters.yearTo && (
                                        <span
                                            onClick={() => updateFilter({ yearTo: null })}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 transition-all hover:bg-blue-500/20"
                                        >
                                            To {filters.yearTo} <X size={10} />
                                        </span>
                                    )}
                                    {filters.ratingMin !== null && (
                                        <span
                                            onClick={() => updateFilter({ ratingMin: null })}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400 transition-all hover:bg-yellow-500/20"
                                        >
                                            ≥ {filters.ratingMin}★ <X size={10} />
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── RESULTS INFO ──────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm font-medium text-neutral-500">
                    <span className="font-black text-white">{totalResults.toLocaleString()}</span>{" "}
                    {type === "movie" ? "movies" : "series"} found
                    {filters.search && (
                        <span className="text-neutral-600">
                            {" "}for &ldquo;<span className="text-red-500">{filters.search}</span>&rdquo;
                        </span>
                    )}
                    {filters.language && (
                        <span className="text-neutral-600">
                            {" "}in <span className="text-purple-400">{LANGUAGES.find((l) => l.code === filters.language)?.label}</span>
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}
