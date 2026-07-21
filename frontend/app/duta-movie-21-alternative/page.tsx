import { Metadata } from "next";
import Link from "next/link";
import { MotionDiv } from "@/components/layout/Motion";
import { Play, Search, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: "Best Duta Movie 21 Alternative: Watch Free Movies Online",
    description: "Looking for a Duta Movie or Duta Movie 21 alternative? Stream free movies and TV series online in HD with Neocinema. No viruses, ultra-fast streaming.",
    keywords: ["duta movie", "duta movie 21", "dutamovie21", "duta film", "duta movie alternative", "watch free movies online", "free movies", "nonton film gratis", "nonton movie"],
    alternates: {
        canonical: "/duta-movie-21-alternative",
    },
};

export default function DutaMovieAlternativePage() {
    // FAQ Schema for "People Also Ask" rich snippets on Google
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the best Duta Movie 21 alternative?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Neocinema is currently the best Duta Movie 21 alternative. It offers ultra-fast HD streaming without the constant barrage of malicious popups often found on older streaming sites."
                }
            },
            {
                "@type": "Question",
                "name": "Is Duta Movie down? Where can I watch free movies online?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Many proxy domains for Duta Movie frequently go down or get blocked. You can watch free movies online securely on platforms like Neocinema, which offers a massive library of trending movies and TV series."
                }
            },
            {
                "@type": "Question",
                "name": "Does Neocinema have Indonesian subtitles like Duta Movie?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Neocinema provides multiple subtitle options including English and Indonesian for a vast majority of its movies and TV shows, making it the perfect Duta Movie replacement."
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
                        Streaming Guide 2026
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                        The Best <span className="text-red-500">Duta Movie 21</span> Alternative
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed">
                        If you've been searching for a reliable <strong>Duta Movie 21</strong> alternative or a faster way to stream new movies online without dealing with broken links or endless pop-ups—you've finally found it. Welcome to Neocinema.
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
                        <h3 className="text-xl font-bold text-white mb-2">No Malicious Ads</h3>
                        <p className="text-sm text-neutral-400">Tired of clicking "Play" on Duta Movie only to get redirected to a sketchy site? We built a clean UI that respects your device's security.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                        <Zap className="text-red-500 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-bold text-white mb-2">Ultra-Fast Servers</h3>
                        <p className="text-sm text-neutral-400">Say goodbye to buffering. Stream new movies in HD instantly using our optimized edge networks, just like the old DutaMovie21.</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                        <Search className="text-red-500 mb-4 h-10 w-10" />
                        <h3 className="text-xl font-bold text-white mb-2">Multi-Language Subs</h3>
                        <p className="text-sm text-neutral-400">Enjoy your favorite films with high-quality subtitles in multiple languages, making it the perfect replacement for Duta Movie.</p>
                    </div>
                </div>

                {/* SEO Content Section */}
                <article className="prose prose-invert prose-red max-w-none">
                    <h2 className="text-3xl font-bold text-white mb-4 mt-12">Why is Duta Movie Down?</h2>
                    <p className="mb-6">
                        If you're wondering why <strong>Duta Movie 21</strong> is down or why your favorite proxy domain isn't loading, it's because older streaming sites are constantly battling ISP blocks and server outages. This leaves users scrambling to find a safe "free movies online" platform that actually works.
                    </p>

                    <h2 className="text-3xl font-bold text-white mb-4 mt-12">The Ultimate Streaming Replacement</h2>
                    <p className="mb-6">
                        For users who loved the simplicity of Dutamovie21, Neocinema offers a vastly superior alternative. Why risk downloading files from unknown sources when you can stream the exact same Hollywood blockbusters, Asian dramas, and trending films directly in your browser? Our player supports fast-forwarding, subtitle selection, and seamless streaming even on slower connections.
                    </p>

                    <div className="bg-neutral-900 border border-red-500/20 p-8 rounded-2xl mt-12 text-center">
                        <h3 className="text-2xl font-black text-white mb-4">Ready to upgrade your streaming experience?</h3>
                        <p className="text-neutral-400 mb-6">Stop searching for Duta Movie proxy sites. Bookmark Neocinema today and start watching instantly.</p>
                        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            Start Watching Now
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}
