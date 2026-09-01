"use client";

import { useEffect, useRef } from "react";

export default function AdsterraNativeBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;
        
        // Prevent double injection
        if (bannerRef.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = "https://scarleterror.com/dcbee4d1696d82a7378d3aa14780aa77/invoke.js";
        
        bannerRef.current.appendChild(script);
    }, []);

    return (
        <section className="relative my-8 sm:my-12 overflow-hidden pointer-events-auto">
            {/* Header Section */}
            <div className="mb-4 flex items-end justify-between gap-6">
                <div className="flex items-end gap-3 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                        <span>Recommended For You</span>
                        <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase border border-white/10 rounded-full px-2 py-0.5">
                            Ad
                        </span>
                    </h2>
                </div>
            </div>

            <div className="w-full flex justify-center items-center overflow-hidden">
                <div 
                    ref={bannerRef} 
                    id="container-dcbee4d1696d82a7378d3aa14780aa77" 
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-3 shadow-xl overflow-hidden"
                >
                    {/* The ad will be injected here by Adsterra */}
                </div>
            </div>
        </section>
    );
}


