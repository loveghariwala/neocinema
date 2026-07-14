import { Metadata } from "next";
import Link from "next/link";
import { MotionDiv } from "@/components/layout/Motion";
import { Play, Search, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: "Best Fmovies Alternative 2024: Watch Free Movies Online (123Movies Replacement)",
    description: "Looking for an Fmovies alternative or a replacement for 123movies? Stream free movies online in HD with NetMirrors in the USA and India. No viruses, ultra-fast streaming, and AI recommendations.",
    keywords: [
        "fmovies", 
        "fmovies alternative", 
        "123movies alternative", 
        "fmovies india", 
        "fmovies alternative usa", 
        "watch free movies online", 
        "free movies", 
        "new movies streaming", 
        "fmovies down", 
        "fmovies unblocked usa",
        "vegamovies alternative"
    ],
    alternates: {
        canonical: "/best-fmovies-alternative-2024",
    },
};

export default function FMoviesAlternativePage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    // FAQ Schema for "People Also Ask" rich snippets on Google
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the best Fmovies alternative in 2024?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "NetMirrors is currently the best Fmovies alternative. Unlike older streaming sites, it is built on modern architecture ensuring ultra-fast HD streaming without the constant barrage of malicious popups."
                }
            },
            {
                "@type": "Question",
                "name": "Is 123movies down? Where can I watch free movies online?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many proxy domains for 123movies frequently go down. You can watch free movies online securely on platforms like NetMirrors, which offers a massive library of trending movies and TV series."
                }
            },
            {
                "@type": "Question",
                "name": "How is NetMirrors different from Vegamovies or Bappam movies?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While Vegamovies and Bappam movies often require downloading massive files, NetMirrors allows you to stream directly in your browser with zero downloads required."
                }
            },
            {
                "@type": "Question",
                "name": "Does NetMirrors work in the USA and India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, NetMirrors uses a global CDN to provide ultra-fast streaming speeds. Whether you are searching for an Fmovies alternative in the USA or want to stream Bollywood hits in India, the platform works seamlessly without a VPN."
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-black text-neutral-300 py-24 px-6 md:px-16 lg:px-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-4 inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/20">
                        Streaming Guide 2024
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                        The Best <span className="text-red-500">Fmovies Alternative</span> to Watch Free Movies Online
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed">
                        If you've been searching for an Fmovies alternative, a reliable replacement for 123movies, or a faster way to stream new movies online without dealing with vegamovies downloads—you've finally found it. Welcome to the future of cinematic discovery.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-16">
                        <Link href="/movies" className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-105">
                            <Play size={18} fill="currentColor" />
                            Browse New Movies
                        </Link>
                        <Link href="/series" className="flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/20">
                            Explore TV Series
                        </Link>
                    </div>
                </MotionDiv>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                        <ShieldCheck className="text-red-500 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-bold text-white mb-2">No Fake Buttons</h3>
                        <p className="text-sm text-neutral-400">Tired of clicking "Play" on 123movies only to be redirected? We built a clean, premium UI that respects your time.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                        <Zap className="text-red-500 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-bold text-white mb-2">Ultra-Fast Servers</h3>
                        <p className="text-sm text-neutral-400">Say goodbye to buffering. Stream new movies in HD instantly using our optimized edge networks.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                        <Search className="text-red-500 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-bold text-white mb-2">AI Discovery</h3>
                        <p className="text-sm text-neutral-400">Can't decide what to watch? Our AI analyzes your tastes to recommend hidden gems you won't find anywhere else.</p>
                    </div>
                </div>

                {/* SEO Content Section */}
                <article className="prose prose-invert prose-red max-w-none">
                    <h2 className="text-3xl font-bold text-white mb-4 mt-12">Why is Fmovies Down?</h2>
                    <p className="mb-6">
                        If you're wondering why Fmovies is down or why your favorite 123movies proxy domain isn't loading, it's because older streaming architectures are constantly battling DMCA takedowns and server outages. This leaves millions of users scrambling to find a safe "free movies online" platform.
                    </p>

                    <h2 className="text-3xl font-bold text-white mb-4 mt-12">The Ultimate Streaming Site for the USA & India</h2>
                    <p className="mb-6">
                        For users in regions where downloading from sites like Vegamovies is the norm (especially across India), NetMirrors offers a vastly superior streaming alternative. Why risk downloading a massive file that might contain malware when you can stream "Trending Hindi Movies" or Hollywood blockbusters directly in your browser? 
                    </p>
                    <p className="mb-6">
                        Similarly, for viewers in the USA dealing with constant ISP blocks on older sites, NetMirrors's global edge network guarantees that you can watch free movies online in HD without buffering or needing a complex VPN setup. It truly is the ultimate global <strong>FMovies alternative</strong>.
                    </p>
 
                    <div className="bg-neutral-900 border border-red-500/20 p-8 rounded-2xl mt-12 text-center">
                        <h3 className="text-2xl font-black text-white mb-4">Ready to upgrade your streaming experience?</h3>
                        <p className="text-neutral-400 mb-6">Stop searching for Fmovies proxies. Bookmark NetMirrors today and start watching instantly.</p>
                        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            Start Watching Now
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}
