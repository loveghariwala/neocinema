import { Metadata } from "next";
import Film from "lucide-react/dist/esm/icons/film";
import Search from "lucide-react/dist/esm/icons/search";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Users from "lucide-react/dist/esm/icons/users";
import Shield from "lucide-react/dist/esm/icons/shield";
import Globe from "lucide-react/dist/esm/icons/globe";


export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about NetMirrors — an AI-powered movie and TV series discovery platform. Discover our mission, technology, and the team behind the cinematic experience.",
    alternates: { canonical: "/about" },
    robots: { index: true, follow: true },
};

const features = [
    {
        icon: Film,
        title: "Cinematic Discovery",
        description: "Browse thousands of movies and TV series with rich metadata, trailers, cast information, and user ratings sourced from trusted databases.",
    },
    {
        icon: Search,
        title: "AI-Powered Search",
        description: "Our semantic search engine powered by vector embeddings understands natural language queries, letting you find content by mood, theme, or description.",
    },
    {
        icon: Sparkles,
        title: "Smart Recommendations",
        description: "Get personalized suggestions based on your viewing preferences, powered by machine learning algorithms that understand your taste.",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Built with feedback from movie enthusiasts worldwide. We continuously improve based on user insights and community suggestions.",
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "We respect your privacy and are committed to transparent data practices. No personal data is sold or shared with unauthorized parties.",
    },
    {
        icon: Globe,
        title: "Global Content",
        description: "Discover entertainment from around the world — Hollywood blockbusters, Bollywood hits, Korean dramas, anime, and independent films.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                {/* Hero */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 pb-2">
                        About <span className="text-red-600">NetMirrors</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-3xl">
                        NetMirrors is an AI-powered cinematic discovery platform designed to help movie and television enthusiasts
                        find their next favorite watch. We combine cutting-edge technology with a passion for cinema to create
                        a seamless, beautiful, and intelligent browsing experience.
                    </p>
                </div>

                {/* Mission Section */}
                <section className="mb-20">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-neutral-400 leading-relaxed text-lg mb-6">
                                We believe discovering great entertainment should be effortless and enjoyable. In a world overflowing
                                with content choices, NetMirrors cuts through the noise by combining AI-powered recommendations with
                                a beautifully crafted interface that makes browsing feel like an experience in itself.
                            </p>
                            <p className="text-neutral-400 leading-relaxed text-lg">
                                Our platform aggregates publicly available information from trusted sources like The Movie Database (TMDB)
                                and enriches it with our proprietary AI models to deliver personalized, relevant content suggestions.
                                We are committed to providing a free, accessible platform for film lovers everywhere.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-red-500 group-hover:bg-red-500/20 transition-all duration-500">
                                        <feature.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technology */}
                <section className="mb-20">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 md:p-12 backdrop-blur-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Technology</h2>
                        <p className="text-neutral-400 leading-relaxed mb-6">
                            NetMirrors is built with modern web technologies to deliver a fast, responsive, and visually stunning experience:
                        </p>
                        <ul className="space-y-4 text-neutral-400">
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 font-bold mt-1">▸</span>
                                <span><strong className="text-white">Next.js & React</strong> — Server-side rendering for lightning-fast page loads and SEO optimization.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 font-bold mt-1">▸</span>
                                <span><strong className="text-white">AI & Machine Learning</strong> — Semantic vector search and recommendation engine for intelligent content discovery.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 font-bold mt-1">▸</span>
                                <span><strong className="text-white">TMDB Integration</strong> — Real-time movie and TV metadata from The Movie Database, ensuring up-to-date information.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-500 font-bold mt-1">▸</span>
                                <span><strong className="text-white">Vercel Edge Network</strong> — Global CDN deployment for minimum latency worldwide.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Team */}
                <section className="mb-20">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Team</h2>
                            <p className="text-neutral-400 leading-relaxed mb-6">
                                NetMirrors was founded by <strong className="text-white">Love Ghariwala</strong>, a full-stack developer and AI engineer
                                with a deep passion for cinema and emerging web technologies. What started as a personal project to explore
                                AI-powered content discovery has grown into a comprehensive platform used by film enthusiasts worldwide.
                            </p>
                            <p className="text-neutral-400 leading-relaxed">
                                We are a small, dedicated team committed to continuous improvement. We actively listen to user feedback
                                and regularly ship new features, performance optimizations, and design enhancements to make NetMirrors
                                the best movie discovery experience on the web.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Disclaimer */}
                <section className="mb-20">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950/50 p-8 md:p-12 backdrop-blur-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Content Attribution</h2>
                        <p className="text-neutral-400 leading-relaxed mb-4">
                            NetMirrors is a content discovery and information platform. All movie and TV series metadata, including
                            titles, descriptions, poster images, and cast information, is sourced from The Movie Database (TMDB) API.
                            This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
                        <p className="text-neutral-400 leading-relaxed">
                            All movie posters, backdrop images, trailers, and related media are the property of their respective
                            copyright holders. NetMirrors does not claim ownership of any third-party content displayed on the platform.
                        </p>
                    </div>
                </section>

                {/* Contact CTA */}
                <section>
                    <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-600/10 to-transparent p-8 md:p-12 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
                        <p className="text-neutral-400 mb-6">
                            Have questions, suggestions, or partnership inquiries? We&apos;d love to hear from you.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
