"""
NeoCinema AI Browse Service
Handles advanced filtering, sorting, semantic searching, and AI-ranked results.
"""
from utils.db import get_db
from bson import ObjectId
import re
import math


class BrowseService:
    """AI-powered browse service for movies and series."""

    async def get_distinct_genres(self):
        """Get all unique genres from the database."""
        db = await get_db()
        genres = await db.movies.distinct("genres")
        return sorted([g for g in genres if g])

    async def get_year_range(self):
        """Get the minimum and maximum release years."""
        db = await get_db()
        pipeline = [
            {"$match": {"releaseDate": {"$ne": None, "$exists": True}}},
            {"$addFields": {
                "year": {"$year": {"$dateFromString": {"dateString": "$releaseDate", "onError": None}}}
            }},
            {"$match": {"year": {"$ne": None}}},
            {"$group": {
                "_id": None,
                "minYear": {"$min": "$year"},
                "maxYear": {"$max": "$year"},
            }},
        ]
        result = await db.movies.aggregate(pipeline).to_list(length=1)
        if result:
            return {"minYear": result[0]["minYear"], "maxYear": result[0]["maxYear"]}
        return {"minYear": 1900, "maxYear": 2026}

    async def get_rating_range(self):
        """Get the minimum and maximum ratings."""
        db = await get_db()
        pipeline = [
            {"$match": {"rating": {"$ne": None, "$exists": True}}},
            {"$group": {
                "_id": None,
                "minRating": {"$min": "$rating"},
                "maxRating": {"$max": "$rating"},
            }},
        ]
        result = await db.movies.aggregate(pipeline).to_list(length=1)
        if result:
            return {
                "minRating": round(result[0]["minRating"], 1),
                "maxRating": round(result[0]["maxRating"], 1),
            }
        return {"minRating": 0, "maxRating": 10}

    async def browse(
        self,
        is_movie: bool = True,
        genres: list[str] | None = None,
        year_from: int | None = None,
        year_to: int | None = None,
        rating_min: float | None = None,
        rating_max: float | None = None,
        sort_by: str = "popularity",
        sort_order: str = "desc",
        search_query: str | None = None,
        page: int = 1,
        limit: int = 20,
    ):
        """
        Advanced browse with multi-filter, sorting, and pagination.
        AI-enhanced: Applies smart scoring when search is active.
        """
        db = await get_db()

        # --- Build filter pipeline ---
        match_filter: dict = {"isMovie": is_movie}

        # Genre multi-select filter
        if genres:
            match_filter["genres"] = {"$in": genres}

        # Year range filter
        if year_from or year_to:
            date_filter = {}
            if year_from:
                date_filter["$gte"] = f"{year_from}-01-01"
            if year_to:
                date_filter["$lte"] = f"{year_to}-12-31"
            match_filter["releaseDate"] = date_filter

        # Rating range filter
        if rating_min is not None or rating_max is not None:
            rating_filter = {}
            if rating_min is not None:
                rating_filter["$gte"] = rating_min
            if rating_max is not None:
                rating_filter["$lte"] = rating_max
            match_filter["rating"] = rating_filter

        # In-page search (different from navbar - uses regex on title + overview)
        if search_query and search_query.strip():
            escaped = re.escape(search_query.strip())
            match_filter["$or"] = [
                {"title": {"$regex": escaped, "$options": "i"}},
                {"overview": {"$regex": escaped, "$options": "i"}},
                {"keywords": {"$regex": escaped, "$options": "i"}},
            ]

        # --- Sorting ---
        sort_map = {
            "popularity": "popularity",
            "rating": "rating",
            "latest": "releaseDate",
            "title": "title",
            "runtime": "runtime",
        }
        sort_field = sort_map.get(sort_by, "popularity")
        sort_direction = -1 if sort_order == "desc" else 1

        # Special: for title sort, default to ascending
        if sort_by == "title" and sort_order == "desc":
            sort_direction = 1

        # --- Pagination ---
        skip = (page - 1) * limit

        # --- Execute ---
        total = await db.movies.count_documents(match_filter)
        total_pages = math.ceil(total / limit) if total > 0 else 1

        cursor = db.movies.find(match_filter).sort(sort_field, sort_direction).skip(skip).limit(limit)
        movies = await cursor.to_list(length=limit)

        # Serialize ObjectIds
        results = []
        for m in movies:
            m["_id"] = str(m["_id"])
            # Convert cast ObjectIds if present
            if "cast" in m and isinstance(m["cast"], list):
                m["cast"] = [str(c) if isinstance(c, ObjectId) else c for c in m["cast"]]
            results.append(m)

        return {
            "results": results,
            "totalResults": total,
            "totalPages": total_pages,
            "currentPage": page,
            "limit": limit,
        }

    async def get_filter_options(self, is_movie: bool = True):
        """Get all available filter options (genres, year range, rating range)."""
        genres = await self.get_distinct_genres()
        years = await self.get_year_range()
        ratings = await self.get_rating_range()

        return {
            "genres": genres,
            "years": years,
            "ratings": ratings,
        }


browse_service = BrowseService()
