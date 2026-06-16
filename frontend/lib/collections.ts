export interface Collection {
    slug: string;
    title: string;
    description: string;
    image: string; // Background image for the collection card
    type: "movie" | "tv";
    params: {
        with_genres?: string;
        sort_by?: string;
        rating_min?: number;
        year_from?: number;
        year_to?: number;
        with_keywords?: string;
        language?: string;
        with_companies?: string;
    };
    seoKeywords: string[];
}

export const COLLECTIONS: Collection[] = [
    {
        slug: "cyberpunk-classics",
        title: "Modern Cyberpunk & Dystopia",
        description: "Dive into a dystopian future with the best modern cyberpunk and neo-noir sci-fi films.",
        image: "/neocinema_logo.png", // We can use a generic image or fetch dynamically later
        type: "movie",
        params: {
            with_genres: "878,53", // Sci-Fi, Thriller
            sort_by: "popularity.desc",
            rating_min: 6.5,
            year_from: 2000,
        },
        seoKeywords: ["cyberpunk movies", "best neo-noir films", "modern sci-fi movies", "dystopian movies to watch", "cyberpunk movies 2020s"]
    },
    {
        slug: "adrenaline-action",
        title: "Adrenaline Rush Action",
        description: "Heart-pounding, high-octane action movies guaranteed to keep you on the edge of your seat.",
        image: "/neocinema_logo.png",
        type: "movie",
        params: {
            with_genres: "28,80", // Action, Crime
            sort_by: "popularity.desc",
            rating_min: 6.5,
        },
        seoKeywords: ["best action movies", "high octane action films", "top crime thrillers", "adrenaline rush movies", "watch action movies online"]
    },
    {
        slug: "feel-good-comedies",
        title: "Feel-Good Comedies",
        description: "Need a laugh? These highly-rated comedies are guaranteed to boost your mood.",
        image: "/neocinema_logo.png",
        type: "movie",
        params: {
            with_genres: "35,10751", // Comedy, Family
            sort_by: "popularity.desc",
            rating_min: 7,
        },
        seoKeywords: ["feel good comedies", "best family comedy movies", "funny movies to watch", "uplifting movies", "comedy films for family"]
    },
    {
        slug: "timeless-romance",
        title: "Timeless Romance",
        description: "From epic love stories to modern rom-coms, explore the most captivating romantic movies ever made.",
        image: "/neocinema_logo.png",
        type: "movie",
        params: {
            with_genres: "10749", // Romance
            sort_by: "popularity.desc",
            rating_min: 7,
        },
        seoKeywords: ["best romantic movies", "timeless romance films", "romantic comedies", "movies for date night", "top romance movies online"]
    },
    {
        slug: "mystery-thrillers",
        title: "Mystery & Thriller",
        description: "Suspenseful, unpredictable, and edge-of-your-seat thrillers that will keep you guessing until the very end.",
        image: "/neocinema_logo.png",
        type: "movie",
        params: {
            with_genres: "53|964", // Thriller OR Mystery
            sort_by: "popularity.desc",
            rating_min: 7.0,
        },
        seoKeywords: ["best mystery movies", "top thriller movies", "psychological thrillers", "suspense movies", "murder mystery movies"]
    },
    {
        slug: "late-night-thrillers",
        title: "Late Night Thrillers",
        description: "Controversial, provocative, and unapologetically mature. Explore adult-oriented dramas, sensual romances, and international hits like Mamasan.",
        image: "/neocinema_logo.png",
        type: "movie",
        params: {
            with_genres: "18|10749", // Drama OR Romance
            language: "tl", // Tagalog
            sort_by: "popularity.desc",
        },
        seoKeywords: ["vivamax movies", "18+ pinoy movies", "movies like mamasan", "filipino adult dramas", "tagalog mature movies"]
    }
];

export function getCollectionBySlug(slug: string): Collection | undefined {
    return COLLECTIONS.find(c => c.slug === slug);
}
