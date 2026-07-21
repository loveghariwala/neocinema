import { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/collections";
import { Film } from 'lucide-react';


export const metadata: Metadata = {
    title: "Curated Movie Collections",
    description: "Discover hand-picked lists of the best movies and TV series tailored by genre, mood, and style. From cyberpunk classics to feel-good comedies.",
    keywords: ["curated movie lists", "best movies by genre", "movie collections", "what to watch tonight", "top rated film lists"],
    alternates: { canonical: "/collections" },
    openGraph: {
        title: "Curated Movie Collections | Neocinema",
        description: "Discover hand-picked lists of the best movies and TV series.",
        url: "/collections",
        type: "website",
    }
};

export default function CollectionsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Curated Movie Collections",
        "description": "Discover hand-picked lists of the best movies and TV series tailored by genre, mood, and style. From cyberpunk classics to feel-good comedies.",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com'}/collections`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": COLLECTIONS.map((c, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com'}/collections/${c.slug}`,
                "name": c.title,
                "description": c.description
            }))
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-16 lg:px-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-4 pb-2">
                        Curated Collections
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl">
                        Hand-picked selections of the finest cinema. Perfect for when you don't know what to watch, but know exactly how you want to feel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {COLLECTIONS.map((collection) => (
                        <Link 
                            key={collection.slug} 
                            href={`/collections/${collection.slug}`}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 transition-all duration-500 hover:border-red-500/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(220,38,38,0.3)] backdrop-blur-xl flex flex-col justify-between min-h-[300px]"
                        >
                            {/* Cinematic Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-red-500 group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-500">
                                    <Film size={28} />
                                </div>
                                <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-red-400 transition-all duration-300">
                                    {collection.title}
                                </h2>
                                <p className="text-neutral-400 leading-relaxed">
                                    {collection.description}
                                </p>
                            </div>

                            <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-red-500 uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                                Explore Collection <span className="ml-2">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
