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
        image: "/netmirrors_logo.jpg", // We can use a generic image or fetch dynamically later
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
        image: "/netmirrors_logo.jpg",
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
        image: "/netmirrors_logo.jpg",
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
        image: "/netmirrors_logo.jpg",
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
        image: "/netmirrors_logo.jpg",
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
        image: "/netmirrors_logo.jpg",
        type: "movie",
        params: {
            with_genres: "18|10749", // Drama OR Romance
            language: "tl", // Tagalog
            sort_by: "popularity.desc",
        },
        seoKeywords: ["vivamax movies", "18+ pinoy movies", "movies like mamasan", "filipino adult dramas", "tagalog mature movies"]
    },
    {
        slug: "bollywood-blockbusters",
        title: "Top Rated Hindi Blockbusters",
        description: "Stream the highest-rated Hindi and Bollywood movies. From intense action to heartwarming family dramas.",
        image: "/netmirrors_logo.jpg",
        type: "movie",
        params: {
            language: "hi",
            sort_by: "popularity.desc",
            rating_min: 6,
        },
        seoKeywords: ["watch hindi movies online", "bollywood movies free", "latest hindi dubbed movies", "top rated indian movies", "free bollywood streaming"]
    },
    {
        slug: "korean-dramas",
        title: "Trending K-Dramas",
        description: "Binge-watch the most addictive South Korean television series and dramas.",
        image: "/netmirrors_logo.jpg",
        type: "tv",
        params: {
            language: "ko",
            sort_by: "popularity.desc",
        },
        seoKeywords: ["watch kdrama free", "korean dramas online", "korean series with english subtitles", "best kdramas 2024", "free korean streaming"]
    },
    {
        slug: "anime-masterpieces",
        title: "Epic Anime Series",
        description: "The highest-rated Japanese anime series. Watch epic shonen battles, deep psychological thrillers, and beautiful slice-of-life.",
        image: "/netmirrors_logo.jpg",
        type: "tv",
        params: {
            language: "ja",
            with_genres: "16", // Animation
            sort_by: "popularity.desc",
        },
        seoKeywords: ["watch anime free", "best anime series", "japanese anime english sub", "top rated anime online", "free anime streaming site"]
    },
    {
        slug: "superhero-universe",
        title: "Superhero Universe",
        description: "Epic superhero movies from the biggest comic book universes. Action, explosions, and legendary heroes.",
        image: "/netmirrors_logo.jpg",
        type: "movie",
        params: {
            with_keywords: "9715", // superhero keyword in TMDB
            sort_by: "popularity.desc",
        },
        seoKeywords: ["marvel movies free", "dc movies online", "superhero movies streaming", "watch avengers free", "batman movies online"]
    },
    {
        slug: "horror-nights",
        title: "Terrifying Horror Nights",
        description: "Turn off the lights. These are the most terrifying and highly-rated horror movies ever made.",
        image: "/netmirrors_logo.jpg",
        type: "movie",
        params: {
            with_genres: "27", // Horror
            sort_by: "popularity.desc",
            rating_min: 6,
        },
        seoKeywords: ["scary movies online", "watch horror movies free", "best horror films", "slasher movies streaming", "paranormal movies free"]
    }
];

export function getCollectionBySlug(slug: string): Collection | undefined {
    return COLLECTIONS.find(c => c.slug === slug);
}
