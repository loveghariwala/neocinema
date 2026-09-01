import { BLOG_POSTS } from "@/lib/blog-posts";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Image from "next/image";



const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    title: "Movie Guides, Anime Lists & Streaming News | NeoCinema Blog",
    description: "Explore NeoCinema's curated blog for the best movie watchlists, anime recommendations, K-Drama streaming guides, and cinema analysis updated weekly.",
    keywords: [
        "movie guides",
        "best movies to watch",
        "anime recommendations",
        "kdrama streaming guide",
        "entertainment news",
        "marvel movies in order",
        "best free movie streaming sites"
    ],
    alternates: { canonical: `${baseUrl}/blog` },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: "Movie Guides, Anime Lists & Streaming News | NeoCinema Blog",
        description: "Your ultimate guide to movie discovery, curated watchlists, and entertainment recommendations.",
        url: `${baseUrl}/blog`,
        siteName: "NeoCinema",
        type: "website",
        images: [
            {
                url: `${baseUrl}/og_banner.png`,
                width: 1200,
                height: 630,
                alt: "NeoCinema Blog Journal",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Movie Guides, Anime Lists & Streaming News | NeoCinema Blog",
        description: "Your ultimate guide to movie discovery, curated watchlists, and entertainment recommendations.",
        images: [`${baseUrl}/og_banner.png`],
        creator: "@neocinematv",
    },
};

export default function BlogIndexPage() {
    const posts = [...BLOG_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    const blogIndexJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "NeoCinema Journal",
        "description": "Streaming guides, release order chronologies, anime recommendations, and cinema analysis.",
        "url": `${baseUrl}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": "NeoCinema",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
        },
        "blogPost": posts.map((p) => ({
            "@type": "BlogPosting",
            "headline": p.title,
            "description": p.description,
            "url": `${baseUrl}/blog/${p.slug}`,
            "datePublished": p.publishedAt,
            "dateModified": p.updatedAt,
            "image": p.imageUrl || `${baseUrl}/og_banner.png`,
        })),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl,
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${baseUrl}/blog`,
            },
        ],
    };

    return (
        <main className="min-h-screen pt-28 pb-24 text-white relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
                        The <span className="text-red-500">Neocinema</span> Journal
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 font-medium">
                        Streaming guides, release order chronologies, anime recommendations, and cinema analysis.
                    </p>
                </div>

                {/* Featured Top Post */}
                {featuredPost && (
                    <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="group relative rounded-3xl border border-white/10 bg-neutral-950/80 p-6 sm:p-10 backdrop-blur-2xl transition-all duration-500 hover:border-red-500/50 hover:shadow-[0_20px_50px_rgba(220,38,38,0.2)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center overflow-hidden"
                    >
                        <div className="md:col-span-6 relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                            {featuredPost.imageUrl ? (
                                <Image
                                    src={featuredPost.imageUrl}
                                    alt={featuredPost.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-neutral-900 text-neutral-700 font-black">
                                    NEOCINEMA
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                FEATURED GUIDE
                            </div>
                        </div>

                        <div className="md:col-span-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                    {featuredPost.category}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                                    <Clock size={11} /> {featuredPost.readTime}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-500 transition-colors leading-tight">
                                {featuredPost.title}
                            </h2>

                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3 font-medium">
                                {featuredPost.description}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {new Date(featuredPost.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-xs font-black uppercase tracking-wider text-red-500 group-hover:text-white transition-colors flex items-center gap-1">
                                    Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Remaining Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-950/60 p-6 backdrop-blur-xl hover:border-red-500/30 hover:bg-white/[0.02] transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                        {post.category}
                                    </span>
                                    <span className="text-[10px] font-bold text-neutral-500 flex items-center gap-1">
                                        <Clock size={10} /> {post.readTime}
                                    </span>
                                </div>

                                {post.imageUrl && (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-md group-hover:border-red-500/40 transition-colors">
                                        <Image 
                                            src={post.imageUrl} 
                                            alt={post.title} 
                                            fill 
                                            unoptimized 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                    </div>
                                )}

                                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>

                                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 font-medium">
                                    {post.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                                <span className="text-[10px] font-bold text-neutral-500 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-xs font-bold text-red-500 group-hover:text-white transition-colors flex items-center gap-1">
                                    Read <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
