"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

export default function ServerNoteBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-full relative z-[45] px-4 md:px-16 pt-24 pb-2 animate-fade-in">
            <style jsx global>{`
                @keyframes warning-glow {
                    0%, 100% {
                        box-shadow: 0 0 15px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.2);
                        border-color: rgba(239, 68, 68, 0.6);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(245, 158, 11, 0.7), inset 0 0 25px rgba(245, 158, 11, 0.3);
                        border-color: rgba(245, 158, 11, 0.9);
                    }
                }
                @keyframes text-blink {
                    0%, 100% {
                        opacity: 1;
                        text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                    }
                    50% {
                        opacity: 0.6;
                        text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
                    }
                }
                @keyframes dot-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                        background-color: #ef4444;
                        box-shadow: 0 0 10px #ef4444;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 0.4;
                        background-color: #f59e0b;
                        box-shadow: 0 0 20px #f59e0b;
                    }
                }
                .warning-banner-container {
                    animation: warning-glow 3s infinite ease-in-out;
                }
                .blinking-warning-text {
                    animation: text-blink 1.5s infinite ease-in-out;
                }
                .warning-dot-pulse {
                    animation: dot-pulse 1.2s infinite ease-in-out;
                }
            `}</style>

            <div className="warning-banner-container max-w-[1600px] mx-auto rounded-2xl border bg-black/60 backdrop-blur-xl p-4 md:p-5 flex items-center justify-between gap-4 transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                    {/* Pulsing Dot and Icon */}
                    <div className="relative flex items-center justify-center flex-shrink-0">
                        <div className="warning-dot-pulse h-3.5 w-3.5 rounded-full absolute -top-1 -right-1" />
                        <div className="rounded-xl bg-red-500/10 p-2 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <AlertCircle size={20} className="text-red-500 animate-bounce" />
                        </div>
                    </div>

                    {/* Banner Text */}
                    <div className="flex-1 min-w-0">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-500 block mb-0.5 sm:mb-1">
                            Important Streaming Notice
                        </span>
                        <p className="blinking-warning-text text-xs sm:text-sm md:text-base font-black text-white leading-relaxed tracking-wide">
                            If server do not work then try changing to another and every server has sub-servers inside it so please check all thank you.
                        </p>
                    </div>
                </div>

                {/* Dismiss Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="rounded-full bg-white/5 p-1.5 md:p-2 text-neutral-400 hover:text-white transition-all hover:bg-white/10 hover:rotate-90 border border-white/5 flex-shrink-0"
                    aria-label="Close Announcement"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
