/**
 * SEO Landing Page Definitions
 * These define the "zipper" strategy pages: Genre × Intent = landing page
 * Each generates a unique, indexable URL targeting long-tail commercial keywords.
 */

export interface WatchLanding {
    slug: string;
    title: string;
    h1: string;
    description: string;
    type: "movie" | "tv";
    params: {
        with_genres?: string;
        language?: string;
        sort_by?: string;
        rating_min?: number;
        year_from?: number;
        year_to?: number;
    };
    keywords: string[];
}

export const WATCH_LANDINGS: WatchLanding[] = [
    {
        slug: "horror-movies-free",
        title: "Horror Movies — Browse & Discover in HD",
        h1: "Horror Movies — Browse & Discover",
        description: "Discover the scariest horror movies. From slashers to supernatural thrillers, explore top-rated horror films with trailers and cast info on Neocinema.",
        type: "movie",
        params: { with_genres: "27", sort_by: "popularity.desc", rating_min: 5.5 },
        keywords: ["horror movies", "scary movies", "best horror films", "horror movie recommendations", "horror movies to watch"],
    },
    {
        slug: "action-movies-free",
        title: "Action Movies — Browse & Discover in HD",
        h1: "Action Movies — Browse & Discover",
        description: "Discover the best action movies. Explosions, car chases, and epic fight scenes — explore top-rated action films with trailers and cast info on Neocinema.",
        type: "movie",
        params: { with_genres: "28", sort_by: "popularity.desc", rating_min: 5.5 },
        keywords: ["action movies", "best action films", "action movie recommendations", "action movies to watch", "top action movies"],
    },
    {
        slug: "comedy-movies-free",
        title: "Comedy Movies — Browse & Discover in HD",
        h1: "Comedy Movies — Browse & Discover",
        description: "Need a laugh? Discover the funniest comedy movies. From rom-coms to slapstick — explore top-rated comedies with trailers on Neocinema.",
        type: "movie",
        params: { with_genres: "35", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["comedy movies", "funny movies", "best comedy films", "comedy movie recommendations", "comedy movies to watch"],
    },
    {
        slug: "romance-movies-free",
        title: "Romance Movies — Browse & Discover in HD",
        h1: "Romance Movies — Browse & Discover",
        description: "Fall in love with the best romantic movies. From classic love stories to modern rom-coms — explore trailers, cast & ratings on Neocinema.",
        type: "movie",
        params: { with_genres: "10749", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["romance movies", "romantic movies", "love movies", "best romance films", "date night movies"],
    },
    {
        slug: "thriller-movies-free",
        title: "Thriller Movies — Browse & Discover in HD",
        h1: "Thriller Movies — Browse & Discover",
        description: "Discover the most suspenseful thriller movies. Edge-of-your-seat tension, plot twists, and psychological mind games — explore on Neocinema.",
        type: "movie",
        params: { with_genres: "53", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["thriller movies", "suspense movies", "psychological thrillers", "best thriller films", "thriller movie recommendations"],
    },
    {
        slug: "sci-fi-movies-free",
        title: "Sci-Fi Movies — Browse & Discover in HD",
        h1: "Science Fiction Movies — Browse & Discover",
        description: "Explore the cosmos with the best sci-fi movies. Space epics, cyberpunk, and mind-bending futures — discover trailers & cast on Neocinema.",
        type: "movie",
        params: { with_genres: "878", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["sci-fi movies", "science fiction movies", "space movies", "best sci-fi films", "cyberpunk movies"],
    },
    {
        slug: "bollywood-movies-free",
        title: "Bollywood Movies — Browse & Discover in HD",
        h1: "Hindi Bollywood Movies — Browse & Discover",
        description: "Discover the latest and greatest Bollywood Hindi movies. From action-packed masala films to emotional dramas — explore on Neocinema.",
        type: "movie",
        params: { language: "hi", sort_by: "popularity.desc" },
        keywords: ["bollywood movies", "hindi movies", "bollywood recommendations", "latest hindi movies", "bollywood movies HD"],
    },
    {
        slug: "korean-dramas-free",
        title: "Korean Dramas — Browse & Discover in HD",
        h1: "K-Dramas — Browse & Discover",
        description: "Discover the best Korean dramas. Romance, thriller, and fantasy K-Dramas with trailers, cast info & where to watch on Neocinema.",
        type: "tv",
        params: { language: "ko", sort_by: "popularity.desc" },
        keywords: ["korean dramas", "kdrama", "best kdramas", "korean series", "kdrama recommendations"],
    },
    {
        slug: "anime-series-free",
        title: "Anime Series — Browse & Discover in HD",
        h1: "Anime — Browse & Discover",
        description: "Discover the best anime series. Shonen, seinen, isekai, and more — explore trailers, ratings & recommendations on Neocinema.",
        type: "tv",
        params: { language: "ja", with_genres: "16", sort_by: "popularity.desc" },
        keywords: ["anime", "anime series", "best anime", "anime recommendations", "anime to watch"],
    },
    {
        slug: "documentary-movies-free",
        title: "Documentaries — Browse & Discover in HD",
        h1: "Documentaries — Browse & Discover",
        description: "Explore the world with the best documentaries. Nature, true crime, history, and science docs — discover on Neocinema.",
        type: "movie",
        params: { with_genres: "99", sort_by: "popularity.desc", rating_min: 6.5 },
        keywords: ["documentaries", "best documentaries", "documentary films", "true crime documentaries", "documentary recommendations"],
    },
    {
        slug: "new-movies-2025",
        title: "New Movies 2025 — Discover Latest Releases",
        h1: "New Movies 2025 — Latest Releases",
        description: "Discover the newest 2025 movie releases. Stay up to date with the latest films, trailers & where to watch on Neocinema.",
        type: "movie",
        params: { year_from: 2025, year_to: 2025, sort_by: "popularity.desc" },
        keywords: ["new movies 2025", "latest movies 2025", "2025 movie releases", "new releases 2025", "best movies 2025"],
    },
    {
        slug: "new-movies-2024",
        title: "Best Movies of 2024 — Discover & Explore",
        h1: "Best Movies of 2024",
        description: "Catch up on the best movies of 2024. Explore top-rated 2024 films with trailers, ratings & cast on Neocinema.",
        type: "movie",
        params: { year_from: 2024, year_to: 2024, sort_by: "popularity.desc" },
        keywords: ["best movies 2024", "movies 2024", "2024 films", "top movies 2024", "2024 movie recommendations"],
    },
    {
        slug: "new-movies-2026",
        title: "New Movies 2026 — Watch Online in HD",
        h1: "Latest Movies of 2026 — Watch Online",
        description: "Discover and stream the newest 2026 movie releases in HD. Stay up to date with the latest films on Neocinema.",
        type: "movie",
        params: { year_from: 2026, year_to: 2026, sort_by: "popularity.desc" },
        keywords: ["new movies 2026", "latest movies 2026", "2026 movie releases", "new releases 2026", "best movies 2026"],
    },
];

export function getWatchLandingBySlug(slug: string): WatchLanding | undefined {
    return WATCH_LANDINGS.find(l => l.slug === slug);
}
