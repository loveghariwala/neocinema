"use client";

import { useEffect, useRef } from "react";


export default function AdsterraNativeBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = true;

    useEffect(() => {
        if (!bannerRef.current) return;
        
        // Prevent double injection in React Strict Mode
        if (bannerRef.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = "https://pl29858380.effectivecpmnetwork.com/dcbee4d1696d82a7378d3aa14780aa77/invoke.js";
        
        bannerRef.current.appendChild(script);
    }, []);

    return (
        <section ref={containerRef} className="relative mb-24 overflow-hidden pointer-events-auto">
            {/* Header Section (Matching MovieRow.tsx) */}
            <div
                className="mb-8 flex items-end justify-between px-6 md:px-16 gap-6"
            >
                <div className="flex items-end gap-4 flex-shrink-0">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase">
                        <span className="flex items-center gap-3">
                            Recommended For You
                            <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase border border-white/10 rounded-full px-2 py-0.5 translate-y-[-4px]">Ad</span>
                        </span>
                        <span className="block h-1 w-1/2 bg-red-600 mt-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </h2>
                </div>
            </div>

            <div
                className="px-6 md:px-16"
            >
                <div className="w-full flex justify-center items-center overflow-hidden">
                    <div ref={bannerRef} id="container-dcbee4d1696d82a7378d3aa14780aa77" className="min-h-[100px] w-full rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors backdrop-blur-sm flex items-center justify-center p-2 shadow-2xl">
                        {/* The ad will be injected here by Adsterra */}
                    </div>
                </div>
            </div>
        </section>
    );
}
