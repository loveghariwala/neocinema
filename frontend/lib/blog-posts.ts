/**
 * NeoCinema Blog System
 * 
 * Lightweight static blog using hardcoded articles.
 * Each post targets a specific long-tail keyword cluster (KD ≤ 30).
 * Content links back to movie/series pages for internal SEO juice.
 */

export interface BlogPost {
    slug: string;
    title: string;
    metaTitle: string;
    description: string;
    keywords: string[];
    publishedAt: string;
    updatedAt: string;
    readTime: string;
    category: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "best-free-movie-streaming-sites-2025",
        title: "7 Best Free Movie Streaming Sites in 2025 (No Sign-Up Required)",
        metaTitle: "7 Best Free Movie Streaming Sites 2025 — No Sign-Up | NeoCinema",
        description: "Looking for free movie streaming sites that actually work in 2025? Here are the top 7 platforms where you can watch movies online without creating an account or paying a subscription.",
        keywords: ["free movie streaming sites 2025", "watch movies free no sign up", "best free streaming sites", "movies online free", "free movie websites"],
        publishedAt: "2025-06-15",
        updatedAt: "2025-06-28",
        readTime: "5 min read",
        category: "Streaming Guides",
    },
    {
        slug: "movies-like-interstellar",
        title: "15 Mind-Bending Movies Like Interstellar You Need to Watch",
        metaTitle: "15 Movies Like Interstellar — Space Epics & Sci-Fi Masterpieces",
        description: "Loved Interstellar? Here are 15 mind-bending sci-fi movies with similar themes of space exploration, time dilation, and human survival that you can stream for free.",
        keywords: ["movies like interstellar", "space movies", "sci-fi movies like interstellar", "movies about space travel", "films similar to interstellar"],
        publishedAt: "2025-06-10",
        updatedAt: "2025-06-25",
        readTime: "7 min read",
        category: "Movie Lists",
    },
    {
        slug: "how-to-watch-marvel-movies-in-order",
        title: "How to Watch Marvel Movies in Order (Complete MCU Timeline 2025)",
        metaTitle: "Marvel Movies in Order — Complete MCU Watch Guide 2025 | NeoCinema",
        description: "Confused by the Marvel timeline? Here's the definitive guide to watching all MCU movies in chronological order, from Captain America: The First Avenger to the latest 2025 releases.",
        keywords: ["marvel movies in order", "MCU timeline", "watch marvel movies chronological order", "marvel movie order 2025", "all marvel movies list"],
        publishedAt: "2025-05-20",
        updatedAt: "2025-06-20",
        readTime: "10 min read",
        category: "Watch Guides",
    },
    {
        slug: "best-korean-dramas-2025",
        title: "Top 20 Korean Dramas to Binge-Watch in 2025 (With English Subs)",
        metaTitle: "Top 20 Korean Dramas 2025 — Best K-Dramas with English Subs",
        description: "Discover the hottest Korean dramas of 2025. From romance to revenge thrillers, here are the 20 must-watch K-Dramas you can stream for free with English subtitles.",
        keywords: ["best korean dramas 2025", "kdrama recommendations", "korean dramas english sub", "top kdramas", "best kdramas to watch"],
        publishedAt: "2025-06-01",
        updatedAt: "2025-06-27",
        readTime: "8 min read",
        category: "TV Guides",
    },
    {
        slug: "best-anime-for-beginners-2025",
        title: "10 Best Anime Series for Beginners — Where to Start Watching in 2025",
        metaTitle: "10 Best Anime for Beginners 2025 — Start Watching Guide | NeoCinema",
        description: "New to anime? Here are 10 beginner-friendly anime series that will hook you instantly. From action epics to emotional dramas — with English sub recommendations.",
        keywords: ["best anime for beginners", "anime recommendations", "where to start watching anime", "beginner anime 2025", "top anime series"],
        publishedAt: "2025-05-25",
        updatedAt: "2025-06-22",
        readTime: "6 min read",
        category: "Anime Guides",
    },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find(p => p.slug === slug);
}
