import mongoose from "mongoose";
import "./People";

const MovieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true },
    title: String,
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    rating: Number,
    popularity: Number,
    runtime: Number,
    language: String,
    status: String,
    tagline: String,
    genres: [String],
    trailers: [String],
    cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "People" }],
    recommendations: [Number],
    productionCompanies: [String],
    keywords: [String],
    isMovie: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
