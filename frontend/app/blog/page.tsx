import { BLOG_POSTS } from "@/lib/blog-posts";
import { Metadata } from "next";
import Link from "next/link";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import Clock from "lucide-react/dist/esm/icons/clock";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Image from "next/image";



export const metadata: Metadata = {
    title: "Blog — Free Streaming Guides, Movie Lists & Recommendations",
    description: "Explore NeoCinema's blog for the best movie lists, streaming guides, anime recommendations, and K-Drama picks. Updated weekly with fresh content.",
    keywords: ["free movie streaming guides", "best movies to watch", "anime recommendations", "kdrama guide", "streaming tips"],
    alternates: { canonical: "/blog" },
    robots: { index: true, follow: true },
    openGraph: {
        title: "NeoCinema Blog — Movie Guides & Streaming Tips",
        description: "Your ultimate guide to free movie streaming, curated movie lists, and entertainment recommendations.",
        url: "/blog",
        type: "website",
    },
};

export default function BlogIndexPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-6 md:px-16">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">NeoCinema</span> Blog
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Movie lists, streaming guides, anime recommendations, and K-Drama picks — updated weekly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...BLOG_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group rounded-2xl border border-white/5 bg-neutral-950/50 p-6 md:p-8 backdrop-blur-xl hover:border-red-500/20 hover:bg-white/[0.03] transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.05)]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                    {post.category}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-600 flex items-center gap-1">
                                    <Clock size={10} /> {post.readTime}
                                </span>
                            </div>

                            <div className="flex flex-row items-center gap-4 mb-3">
                                {post.imageUrl && (
                                    <Image src={post.imageUrl} alt={post.title} width={80} height={80} unoptimized className="w-20 h-20 rounded-xl object-cover" />
                                )}
                                <h2 className="text-lg md:text-xl font-black text-white group-hover:text-red-500 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                            </div>

                            <p className="text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                                {post.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-neutral-600 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-xs font-bold text-red-500 group-hover:text-white transition-colors flex items-center gap-1">
                                    Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
