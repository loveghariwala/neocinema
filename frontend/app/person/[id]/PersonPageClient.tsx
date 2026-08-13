"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Award, Calendar, ChevronDown, ChevronUp, Film, MapPin, Sparkles, Star, Tv, User } from 'lucide-react';
import MovieCard from "@/components/cards/MovieCard";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface PersonPageClientProps {
    data: any;
}

export default function PersonPageClient({ data }: PersonPageClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv" | "top">("all");
    const [bioExpanded, setBioExpanded] = useState(false);

    if (!data || !data.person) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
                <div className="p-4 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 mb-4">
                    <User size={36} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-wider">Cast Member Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-red-500 shadow-lg shadow-red-900/40"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    const { person, results = [] } = data;
    const profileUrl = getTmdbImageUrl(person.profilePath, "h632", person.name);

    const isActor = (person.knownForDepartment || "Acting").toLowerCase().includes("act");
    const departmentLabel = person.knownForDepartment || "Acting & Directing";

    // Filtering logic
    const moviesCount = results.filter((r: any) => r.isMovie !== false).length;
    const tvCount = results.filter((r: any) => r.isMovie === false).length;
    const topRatedCount = results.filter((r: any) => (r.rating || 0) >= 7.0).length;

    const filteredResults = results.filter((item: any) => {
        if (activeTab === "movie") return item.isMovie !== false;
        if (activeTab === "tv") return item.isMovie === false;
        if (activeTab === "top") return (item.rating || 0) >= 7.0;
        return true;
    });

    // Top 4 Career Highlights
    const careerHighlights = [...results]
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

    return (
        <main className="min-h-screen bg-black pb-24 pt-28 text-white relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-red-600/10 via-red-950/5 to-transparent pointer-events-none blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                {/* Back Button */}
                <div>
                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-neutral-300 backdrop-blur-xl transition-all hover:border-red-500/40 hover:bg-red-600/20 hover:text-white cursor-pointer active:scale-95 touch-manipulation"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Discovery</span>
                    </button>
                </div>

                {/* Profile Hero Card */}
                <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                        
                        {/* Profile Image & Badge */}
                        <div className="md:col-span-4 lg:col-span-3 space-y-4">
                            <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl border border-white/10 group">
                                {person.profilePath ? (
                                    <Image
                                        src={profileUrl}
                                        alt={person.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-600">
                                        <User size={56} />
                                        <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Key Stats Chips */}
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-neutral-400">Total Titles</p>
                                    <p className="text-base font-black text-white">{results.length}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] font-black uppercase text-neutral-400">Role</p>
                                    <p className="text-xs font-black text-red-500 truncate">{departmentLabel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details & Bio */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-3">
                                    <Sparkles size={12} />
                                    <span>{isActor ? "Featured Actor & Cast" : "Featured Director & Crew"}</span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                                    {person.name}
                                </h1>
                            </div>

                            {/* Metadata Pills */}
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-neutral-300">
                                {person.birthday && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                        <Calendar size={14} className="text-red-500" />
                                        <span>Born: {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                )}
                                {person.placeOfBirth && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                        <MapPin size={14} className="text-red-500" />
                                        <span>{person.placeOfBirth}</span>
                                    </div>
                                )}
                            </div>

                            {/* Biography */}
                            {person.biography && (
                                <div className="space-y-2.5">
                                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                                        Biography
                                    </h3>
                                    <div className="relative">
                                        <p className={`text-neutral-300 leading-relaxed text-xs sm:text-sm font-medium transition-all ${!bioExpanded ? "line-clamp-4" : ""}`}>
                                            {person.biography}
                                        </p>
                                        {person.biography.length > 250 && (
                                            <button
                                                onClick={() => setBioExpanded(!bioExpanded)}
                                                className="mt-2 text-xs font-black uppercase tracking-wider text-red-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                            >
                                                <span>{bioExpanded ? "Read Less" : "Read Full Bio"}</span>
                                                {bioExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Career Highlights Row */}
                            {careerHighlights.length > 0 && (
                                <div className="pt-4 border-t border-white/5">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-2">
                                        <Award size={14} className="text-amber-400" />
                                        Career Highlights
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {careerHighlights.map((item: any) => (
                                            <div key={item.tmdbId} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all">
                                                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-400 font-black">
                                                    <Star size={10} fill="currentColor" />
                                                    <span>{item.rating?.toFixed(1) || "N/A"}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filmography Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500">
                                <Film size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                                Filmography & Credits
                            </h2>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap border cursor-pointer ${activeTab === "all" ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/40" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"}`}
                            >
                                All ({results.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("movie")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${activeTab === "movie" ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/40" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"}`}
                            >
                                <Film size={12} />
                                Movies ({moviesCount})
                            </button>
                            <button
                                onClick={() => setActiveTab("tv")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${activeTab === "tv" ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/40" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"}`}
                            >
                                <Tv size={12} />
                                TV Series ({tvCount})
                            </button>
                            <button
                                onClick={() => setActiveTab("top")}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${activeTab === "top" ? "bg-amber-500 text-black font-black border-amber-400 shadow-md shadow-amber-900/40" : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"}`}
                            >
                                <Star size={12} />
                                Top Rated ({topRatedCount})
                            </button>
                        </div>
                    </div>

                    {/* Movie Cards Grid */}
                    {filteredResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredResults.map((item: any, i: number) => (
                                <div key={`${item.tmdbId}-${i}`}>
                                    <MovieCard movie={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-white/5 bg-neutral-950/50">
                            <Film size={36} className="mb-3 text-neutral-600" />
                            <h3 className="text-base font-bold text-white">No titles matching this filter</h3>
                            <p className="text-xs text-neutral-500 mt-1">Try switching to the "All" tab to view all credits.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
