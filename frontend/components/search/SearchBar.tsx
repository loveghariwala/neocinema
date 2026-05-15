"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [isFocused, setIsFocused] = useState(false);

    // AUTO SEARCH AFTER 3 LETTERS
    useEffect(() => {
        if (!query.trim()) {
            if (pathname === "/search") {
                router.push("/search");
            }
            return;
        }

        if (query.trim().length < 3) return;

        // Only redirect if the query is different from the current URL param
        const currentQuery = searchParams.get("query");
        if (query === currentQuery) return;

        const timer = setTimeout(() => {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, router]); // Removed pathname from dependencies


    return (
        <div className={`relative w-full max-w-md transition-all duration-300 ${isFocused ? "max-w-xl" : "max-w-md"}`}>
            <div className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 ${
                isFocused 
                    ? "border-red-600/50 bg-neutral-900 shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
                    : "border-white/10 bg-white/5 backdrop-blur-xl"
            }`}>
                <Search size={20} className={isFocused ? "text-red-600" : "text-neutral-500"} />
                
                <input
                    type="text"
                    placeholder="Search movies, series..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-600"
                />

                {query && (
                    <button 
                        onClick={() => setQuery("")}
                        className="text-neutral-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* QUICK TIPS */}
            {query.length > 0 && query.length < 3 && (
                <div className="absolute top-full left-0 mt-3 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="glass-panel rounded-2xl px-5 py-3 text-xs font-bold text-neutral-400 uppercase tracking-widest shadow-2xl">
                        Keep typing...
                    </div>
                </div>
            )}
        </div>
    );
}