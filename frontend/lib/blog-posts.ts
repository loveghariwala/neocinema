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
        slug: "best-free-movie-streaming-sites-2026",
        title: "7 Best Free Movie Streaming Sites in 2026 (No Sign-Up Required)",
        metaTitle: "7 Best Free Movie Streaming Sites 2026 — No Sign-Up | NeoCinema",
        description: "Looking for free movie streaming sites that actually work in 2026? Here are the top 7 platforms where you can watch movies online without creating an account or paying a subscription.",
        keywords: ["free movie streaming sites 2026", "watch movies free no sign up", "best free streaming sites", "movies online free", "free movie websites", "free movie streaming sites 2026"],
        publishedAt: "2026-01-15",
        updatedAt: "2026-06-29",
        readTime: "5 min read",
        category: "Streaming Guides",
    },
    {
        slug: "movies-like-interstellar",
        title: "15 Mind-Bending Movies Like Interstellar You Need to Watch",
        metaTitle: "15 Movies Like Interstellar — Space Epics & Sci-Fi Masterpieces",
        description: "Loved Interstellar? Here are 15 mind-bending sci-fi movies with similar themes of space exploration, time dilation, and human survival that you can stream for free.",
        keywords: ["movies like interstellar", "space movies", "sci-fi movies like interstellar", "movies about space travel", "films similar to interstellar"],
        publishedAt: "2026-02-10",
        updatedAt: "2026-06-29",
        readTime: "7 min read",
        category: "Movie Lists",
    },
    {
        slug: "how-to-watch-marvel-movies-in-order",
        title: "How to Watch Marvel Movies in Order (Complete MCU Timeline 2026)",
        metaTitle: "Marvel Movies in Order — Complete MCU Watch Guide 2026 | NeoCinema",
        description: "Confused by the Marvel timeline? Here's the definitive guide to watching all MCU movies in chronological order, from Captain America: The First Avenger to the latest 2026 releases.",
        keywords: ["marvel movies in order", "MCU timeline", "watch marvel movies chronological order", "marvel movie order 2026", "all marvel movies list"],
        publishedAt: "2026-01-20",
        updatedAt: "2026-06-29",
        readTime: "10 min read",
        category: "Watch Guides",
    },
    {
        slug: "best-korean-dramas-2026",
        title: "Top 20 Korean Dramas to Binge-Watch in 2026 (With English Subs)",
        metaTitle: "Top 20 Korean Dramas 2026 — Best K-Dramas with English Subs",
        description: "Discover the hottest Korean dramas of 2026. From romance to revenge thrillers, here are the 20 must-watch K-Dramas you can stream for free with English subtitles.",
        keywords: ["best korean dramas 2026", "kdrama recommendations", "korean dramas english sub", "top kdramas", "best kdramas to watch", "best korean dramas 2026"],
        publishedAt: "2026-03-01",
        updatedAt: "2026-06-29",
        readTime: "8 min read",
        category: "TV Guides",
    },
    {
        slug: "best-anime-for-beginners-2026",
        title: "10 Best Anime Series for Beginners — Where to Start Watching in 2026",
        metaTitle: "10 Best Anime for Beginners 2026 — Start Watching Guide | NeoCinema",
        description: "New to anime? Here are 10 beginner-friendly anime series that will hook you instantly. From action epics to emotional dramas — with English sub recommendations.",
        keywords: ["best anime for beginners", "anime recommendations", "where to start watching anime", "beginner anime 2026", "top anime series", "beginner anime 2026"],
        publishedAt: "2026-02-25",
        updatedAt: "2026-06-29",
        readTime: "6 min read",
        category: "Anime Guides",
    },
    {
        slug: "upcoming-spiderman-movies",
        title: "Spider-Man 4 & Brand New Day (2026): Cast, Plot Leaks & Where to Watch",
        metaTitle: "Spider-Man 4: Brand New Day (2026) Plot Leaks & Watch Guide",
        description: "The definitive guide to Spider-Man 4: Brand New Day and Beyond the Spider-Verse. Discover insane plot leaks, Tom Holland's return, and where to stream all Spider-Man movies for free.",
        keywords: [
            "upcoming spiderman movies", 
            "spiderman brand new day", 
            "spiderman 4 plot leaks", 
            "peter parker 2026", 
            "where to watch spiderman brand new day free",
            "spider-man brand new day 2026 trailer",
            "will tobey maguire be in spiderman 4",
            "spider-man beyond the spider-verse release date delay",
            "watch spiderman brand new day full movie free online",
            "spider-man 4 cast rumors"
        ],
        publishedAt: "2026-07-03",
        updatedAt: "2026-07-03",
        readTime: "5 min read",
        category: "Movie News",
    },
    {
        slug: "gta-6-game-discussion-release-date",
        title: "GTA 6 Leaks: Massive Map Size, PC Release Date & Crossplay Rumors",
        metaTitle: "GTA 6 Leaks: Map Size vs GTA 5 & PC Release Date Exposed",
        description: "Everything you MUST know about GTA 6 before launch. We break down the leaked map size vs GTA 5, the truth about the $150 price tag rumor, PC release delays, and the dual protagonists.",
        keywords: [
            "gta 6 game discussion", 
            "gta 6 release date", 
            "gta 6 map size", 
            "gta 6 leaks", 
            "gta 6 game size", 
            "is gta 6 ran on pc or only playstation 5",
            "gta 6 map size compared to gta 5",
            "gta 6 pc release date leaked",
            "will gta 6 have crossplay",
            "grand theft auto 6 price 150 dollars rumor",
            "gta 6 lucia and jason story leak"
        ],
        publishedAt: "2026-07-03",
        updatedAt: "2026-07-03",
        readTime: "6 min read",
        category: "Gaming",
    },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find(p => p.slug === slug);
}
