"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WatchlistButtonProps {
    movie: any;
    variant?: "compact" | "large";
}

export default function WatchlistButton({ movie, variant = "large" }: WatchlistButtonProps) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("neocinema-watchlist");
        if (stored) {
            const list = JSON.parse(stored);
            setIsInWatchlist(list.some((m: any) => m._id === String(movie._id || movie.tmdbId)));
        }
    }, [movie]);

    const toggleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const stored = localStorage.getItem("neocinema-watchlist");
        let list = stored ? JSON.parse(stored) : [];

        if (isInWatchlist) {
            list = list.filter((m: any) => m._id !== String(movie._id || movie.tmdbId));
            setIsInWatchlist(false);
        } else {
            // Ensure we store necessary data for the card
            const itemToSave = {
                _id: String(movie._id || movie.tmdbId),
                tmdbId: movie.tmdbId,
                title: movie.title || movie.name,
                posterPath: movie.posterPath,
                rating: movie.rating || movie.vote_average,
                releaseDate: movie.releaseDate || movie.release_date,
                isMovie: movie.isMovie !== false,
                genres: movie.genres || []
            };
            list.push(itemToSave);
            setIsInWatchlist(true);
        }

        localStorage.setItem("neocinema-watchlist", JSON.stringify(list));
        
        // Dispatch custom event for real-time updates if needed
        window.dispatchEvent(new Event("watchlist-updated"));
    };

    if (!mounted) return null;

    if (variant === "compact") {
        return (
            <button
                onClick={toggleWatchlist}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                    isInWatchlist 
                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/40" 
                    : "bg-black/40 border-white/10 text-white hover:bg-white/20"
                }`}
                title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
                <Heart size={18} fill={isInWatchlist ? "currentColor" : "none"} className={isInWatchlist ? "scale-110" : ""} />
            </button>
        );
    }

    return (
        <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-3 rounded-full border px-8 py-5 font-black backdrop-blur-xl transition-all ${
                isInWatchlist
                ? "bg-red-600/20 border-red-600 text-red-500 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
                : "bg-white/5 border-white/20 text-white hover:bg-white/10"
            }`}
        >
            <Heart size={20} fill={isInWatchlist ? "currentColor" : "none"} className={isInWatchlist ? "animate-pulse" : ""} />
            {isInWatchlist ? "SAVED TO WATCHLIST" : "ADD TO WATCHLIST"}
        </button>
    );
}
