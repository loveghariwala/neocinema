import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGO_URI;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!MONGO_URI || !TMDB_ACCESS_TOKEN) {
    console.error("Missing environment variables!");
    process.exit(1);
}

// Minimal models for the script
const MovieSchema = new mongoose.Schema({
    tmdbId: { type: Number, unique: true },
    title: String,
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    rating: Number,
    popularity: Number,
    runtime: Number,
    genres: [String],
    trailers: [String],
    cast: [mongoose.Schema.Types.ObjectId],
    isMovie: { type: Boolean, default: true },
});

const PeopleSchema = new mongoose.Schema({
    tmdbId: { type: Number, unique: true },
    name: String,
    profilePath: String,
    character: String,
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
const People = mongoose.models.People || mongoose.model("People", PeopleSchema);

const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
});

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    let totalIngested = 0;
    const pagesToFetch = 100; // 2000 movies

    for (let page = 1; page <= pagesToFetch; page++) {
        console.log(`\n--- Fetching Page ${page} ---`);
        try {
            const response = await tmdb.get(`/movie/popular?page=${page}`);
            const movies = response.data.results;

            for (const movie of movies) {
                try {
                    // Check if already exists to skip full fetch if possible
                    const existing = await Movie.findOne({ tmdbId: movie.id });
                    if (existing) {
                        console.log(`Skipping existing: ${movie.title}`);
                        continue;
                    }

                    const [details, credits, videos] = await Promise.all([
                        tmdb.get(`/movie/${movie.id}`),
                        tmdb.get(`/movie/${movie.id}/credits`),
                        tmdb.get(`/movie/${movie.id}/videos`),
                    ]);

                    const castIds = [];
                    for (const actor of credits.data.cast.slice(0, 5)) {
                        const savedActor = await People.findOneAndUpdate(
                            { tmdbId: actor.id },
                            {
                                tmdbId: actor.id,
                                name: actor.name,
                                profilePath: actor.profile_path,
                                character: actor.character,
                            },
                            { upsert: true, new: true }
                        );
                        castIds.push(savedActor._id);
                    }

                    await Movie.create({
                        tmdbId: movie.id,
                        title: details.data.title,
                        overview: details.data.overview,
                        posterPath: details.data.poster_path,
                        backdropPath: details.data.backdrop_path,
                        releaseDate: details.data.release_date,
                        rating: details.data.vote_average,
                        popularity: details.data.popularity,
                        runtime: details.data.runtime,
                        genres: details.data.genres.map((g) => g.name),
                        trailers: videos.data.results
                            .filter((v) => v.site === "YouTube")
                            .map((v) => v.key),
                        cast: castIds,
                        isMovie: true,
                    });

                    totalIngested++;
                    process.stdout.write(`+ ${details.data.title} | `);
                } catch (err) {
                    console.error(`\nFailed: ${movie.id}`);
                }
            }
            // Avoid rate limits
            await new Promise((r) => setTimeout(r, 500));
        } catch (err) {
            console.error(`Page ${page} failed`);
        }
    }

    console.log(`\n\nIngestion complete! Total: ${totalIngested}`);
    process.exit(0);
}

run();
