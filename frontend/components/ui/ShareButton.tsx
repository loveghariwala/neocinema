"use client";

import { useState } from "react";
import { Check, Share2 } from 'lucide-react';


interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `${title} — Neocinema`,
            text: `Check out "${title}" on Neocinema!`,
            url: typeof window !== "undefined" ? window.location.href : "",
        };

        // Try utilizing Web Share API first (great for Mobile/Tablets)
        if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // Ignore AbortError (user cancelled share dialog), proceed to copy for other errors
                if (err instanceof Error && err.name !== "AbortError") {
                    console.log("Web Share API failed, falling back to copy:", err);
                } else if (err instanceof Error && err.name === "AbortError") {
                    return;
                }
            }
        }

        // Fallback: Copy link to clipboard (great for Desktop)
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy link:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 sm:gap-3 rounded-full border px-6 py-3.5 sm:px-8 sm:py-5 font-black backdrop-blur-xl transition-all duration-300 text-sm sm:text-base ${
                copied
                ? "bg-green-600/20 border-green-500/50 text-green-400 shadow-lg shadow-green-500/10"
                : "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
            }`}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 scale-110 animate-pulse text-green-400" />
                    COPIED!
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    SHARE
                </>
            )}
        </button>
    );
}
