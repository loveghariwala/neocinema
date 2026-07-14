import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-posts";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return { title: "Not Found", robots: { index: false } };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    return {
        title: { absolute: post.metaTitle },
        description: post.description,
        keywords: post.keywords,
        alternates: { canonical: `/blog/${slug}` },
        robots: { index: true, follow: true },
        openGraph: {
            title: post.metaTitle,
            description: post.description,
            url: `/blog/${slug}`,
            type: "article",
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: ["NetMirrors Editorial"],
            ...(post.imageUrl ? { images: [{ url: post.imageUrl }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: post.metaTitle,
            description: post.description,
            ...(post.imageUrl ? { images: [post.imageUrl] } : {}),
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) notFound();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    // Related posts (exclude current)
    const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

    // Article JSON-LD
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "author": {
            "@type": "Organization",
            "name": "NetMirrors",
            "url": baseUrl,
        },
        "publisher": {
            "@type": "Organization",
            "name": "NetMirrors",
            "logo": { "@type": "ImageObject", "url": `${baseUrl}/netmirrors_logo.jpg` },
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${slug}`,
        },
    };

    // Breadcrumb JSON-LD
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `${baseUrl}/blog/${slug}` },
        ],
    };

    // FAQ JSON-LD
    const faqJsonLd = post.faqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    } : null;

    return (
        <>
            <script
                id="json-ld-article"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                id="json-ld-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            {faqJsonLd && (
                <script
                    id="json-ld-faq"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
                />
            )}

            <main className="min-h-screen pt-24 pb-20 px-6 md:px-16">
                <article className="max-w-3xl mx-auto">
                    {/* Back Link */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={16} /> All Articles
                    </Link>

                    {/* Header */}
                    <header className="mb-12 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                {post.category}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500 flex items-center gap-1">
                                <Clock size={10} /> {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                            {post.description}
                        </p>

                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-600 border-t border-b border-white/5 py-4">
                            <span className="flex items-center gap-1"><Calendar size={10} /> Published: {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {post.imageUrl && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 ">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                priority
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="blog-prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: BLOG_CONTENT[slug] || "<p>Content not found.</p>" }}
                    />

                    {/* Related Articles */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-white/5 space-y-6">
                            <h2 className="text-xl font-black tracking-tight text-white">More Articles</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {relatedPosts.map(rp => (
                                    <Link
                                        key={rp.slug}
                                        href={`/blog/${rp.slug}`}
                                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-red-500/20 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500/70">{rp.category}</span>
                                        <h3 className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors mt-2 line-clamp-2">{rp.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>
        </>
    );
}
