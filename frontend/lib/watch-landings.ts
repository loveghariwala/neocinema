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
        title: "Watch Horror Movies Online Free in HD",
        h1: "Watch Horror Movies Online Free",
        description: "Stream the scariest horror movies for free in HD. From slashers to supernatural thrillers, watch top-rated horror films with no sign-up on NeoCinema.",
        type: "movie",
        params: { with_genres: "27", sort_by: "popularity.desc", rating_min: 5.5 },
        keywords: ["horror movies free", "scary movies online", "watch horror free", "best horror films streaming", "free horror movies no sign up"],
    },
    {
        slug: "action-movies-free",
        title: "Watch Action Movies Online Free in HD",
        h1: "Watch Action Movies Online Free",
        description: "Stream the best action movies for free in HD. Explosions, car chases, and epic fight scenes — all free with no ads on NeoCinema.",
        type: "movie",
        params: { with_genres: "28", sort_by: "popularity.desc", rating_min: 5.5 },
        keywords: ["action movies free", "watch action movies online", "best action films free", "free action movies HD", "action movies no sign up"],
    },
    {
        slug: "comedy-movies-free",
        title: "Watch Comedy Movies Online Free in HD",
        h1: "Watch Comedy Movies Online Free",
        description: "Need a laugh? Stream the funniest comedy movies for free in HD. From rom-coms to slapstick — all free on NeoCinema.",
        type: "movie",
        params: { with_genres: "35", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["comedy movies free", "funny movies online", "watch comedies free", "best comedy films streaming", "free comedy movies"],
    },
    {
        slug: "romance-movies-free",
        title: "Watch Romance Movies Online Free in HD",
        h1: "Watch Romance Movies Online Free",
        description: "Fall in love with the best romantic movies, streaming for free in HD. From classic love stories to modern rom-coms on NeoCinema.",
        type: "movie",
        params: { with_genres: "10749", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["romance movies free", "romantic movies online", "love movies streaming", "best romance films free", "date night movies free"],
    },
    {
        slug: "thriller-movies-free",
        title: "Watch Thriller Movies Online Free in HD",
        h1: "Watch Thriller Movies Online Free",
        description: "Stream the most suspenseful thriller movies for free in HD. Edge-of-your-seat tension, plot twists, and psychological mind games on NeoCinema.",
        type: "movie",
        params: { with_genres: "53", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["thriller movies free", "suspense movies online", "psychological thrillers free", "best thriller films streaming", "free thriller movies"],
    },
    {
        slug: "sci-fi-movies-free",
        title: "Watch Sci-Fi Movies Online Free in HD",
        h1: "Watch Science Fiction Movies Online Free",
        description: "Explore the cosmos with the best sci-fi movies, streaming for free in HD. Space epics, cyberpunk, and mind-bending futures on NeoCinema.",
        type: "movie",
        params: { with_genres: "878", sort_by: "popularity.desc", rating_min: 6 },
        keywords: ["sci-fi movies free", "science fiction movies online", "space movies streaming", "best sci-fi films free", "cyberpunk movies free"],
    },
    {
        slug: "bollywood-movies-free",
        title: "Watch Bollywood Movies Online Free in HD",
        h1: "Watch Hindi Bollywood Movies Online Free",
        description: "Stream the latest and greatest Bollywood Hindi movies for free in HD. From action-packed masala films to emotional dramas on NeoCinema.",
        type: "movie",
        params: { language: "hi", sort_by: "popularity.desc" },
        keywords: ["bollywood movies free", "hindi movies online", "watch bollywood free", "latest hindi movies streaming", "free bollywood movies HD"],
    },
    {
        slug: "korean-dramas-free",
        title: "Watch Korean Dramas Online Free in HD",
        h1: "Watch K-Dramas Online Free",
        description: "Binge-watch the best Korean dramas for free in HD. Romance, thriller, and fantasy K-Dramas with English subtitles on NeoCinema.",
        type: "tv",
        params: { language: "ko", sort_by: "popularity.desc" },
        keywords: ["korean dramas free", "kdrama online", "watch kdrama free", "korean series english sub", "best kdramas streaming"],
    },
    {
        slug: "anime-series-free",
        title: "Watch Anime Series Online Free in HD",
        h1: "Watch Anime Online Free with English Sub",
        description: "Stream the best anime series for free in HD with English subtitles. Shonen, seinen, isekai, and more on NeoCinema.",
        type: "tv",
        params: { language: "ja", with_genres: "16", sort_by: "popularity.desc" },
        keywords: ["anime free", "watch anime online", "anime english sub free", "best anime streaming", "free anime series HD"],
    },
    {
        slug: "documentary-movies-free",
        title: "Watch Documentaries Online Free in HD",
        h1: "Watch Documentaries Online Free",
        description: "Explore the world with the best documentaries streaming for free in HD. Nature, true crime, history, and science docs on NeoCinema.",
        type: "movie",
        params: { with_genres: "99", sort_by: "popularity.desc", rating_min: 6.5 },
        keywords: ["documentaries free", "watch documentaries online", "best documentaries streaming", "free documentary films", "true crime documentaries free"],
    },
    {
        slug: "new-movies-2025",
        title: "New Movies 2025 — Watch Free Online in HD",
        h1: "New Movies 2025 — Watch Free Online",
        description: "Discover and stream the newest 2025 movie releases for free in HD. Stay up to date with the latest films on NeoCinema.",
        type: "movie",
        params: { year_from: 2025, year_to: 2025, sort_by: "popularity.desc" },
        keywords: ["new movies 2025", "latest movies 2025 free", "2025 movie releases", "watch new movies free", "new releases 2025 online"],
    },
    {
        slug: "new-movies-2024",
        title: "New Movies 2024 — Watch Free Online in HD",
        h1: "Best Movies of 2024 — Watch Free Online",
        description: "Catch up on the best movies of 2024. Stream top-rated 2024 films for free in HD on NeoCinema.",
        type: "movie",
        params: { year_from: 2024, year_to: 2024, sort_by: "popularity.desc" },
        keywords: ["best movies 2024", "movies 2024 free", "2024 films online", "watch 2024 movies free", "top movies 2024"],
    },
    {
        slug: "new-movies-2026",
        title: "New Movies 2026 — Watch Online in HD",
        h1: "Latest Movies of 2026 — Watch Online",
        description: "Discover and stream the newest 2026 movie releases in HD. Stay up to date with the latest films on NeoCinema.",
        type: "movie",
        params: { year_from: 2026, year_to: 2026, sort_by: "popularity.desc" },
        keywords: ["new movies 2026", "latest movies 2026", "2026 movie releases", "new releases 2026", "best movies 2026"],
    },
];

export function getWatchLandingBySlug(slug: string): WatchLanding | undefined {
    return WATCH_LANDINGS.find(l => l.slug === slug);
}
