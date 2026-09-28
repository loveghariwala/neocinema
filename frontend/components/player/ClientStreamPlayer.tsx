"use client";

import nextDynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the actual StreamPlayer with SSR disabled
const StreamPlayer = nextDynamic(() => import("./StreamPlayer"), { 
    ssr: false,
    loading: () => (
        <div className="w-full my-6 sm:my-8 rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-950/90 aspect-video flex flex-col items-center justify-center text-neutral-400">
             <Loader2 size={32} className="animate-spin text-red-600 mb-4" />
             <p className="text-sm font-black uppercase tracking-widest">Loading Player...</p>
        </div>
    )
});

export default function ClientStreamPlayer(props: any) {
    return <StreamPlayer {...props} />;
}
