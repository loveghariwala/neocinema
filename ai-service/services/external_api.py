"""
NeoCinema External API Service
Proxies to the videasy.net TMDB mirror for global movies & series data.
Supports: discover, search, genre lists, trending, top-rated, and detail fetching.
"""
import httpx
from typing import Optional
import math

BASE_URL = "https://db.videasy.net/3"
API_KEY = "4c1eef5a8d388386187a3426bc2345be"

# ─── Genre ID Maps (cached) ─────────────────────────────────────────────────
MOVIE_GENRES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
}

TV_GENRES = {
    10759: "Action & Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    10762: "Kids", 9648: "Mystery", 10763: "News", 10764: "Reality",
    10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk",
    10768: "War & Politics", 37: "Western",
}


class ExternalAPIService:
    """Service for fetching movies/series from the external TMDB proxy."""

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=15.0)

    async def _get(self, endpoint: str, params: dict = None) -> dict:
        """Make a GET request to the external API."""
        if params is None:
            params = {}
        params["api_key"] = API_KEY
        url = f"{BASE_URL}{endpoint}"
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def _normalize_movie(self, item: dict) -> dict:
        """Normalize a movie item from TMDB format to our internal format."""
        genre_map = MOVIE_GENRES
        media_type = item.get("media_type", "movie")
        if media_type == "tv":
            genre_map = TV_GENRES

        genre_ids = item.get("genre_ids", [])
        genres = [genre_map.get(gid, f"Unknown({gid})") for gid in genre_ids]

        return {
            "tmdbId": item.get("id"),
            "title": item.get("title") or item.get("name", "Unknown"),
            "overview": item.get("overview", ""),
            "posterPath": item.get("poster_path", ""),
            "backdropPath": item.get("backdrop_path", ""),
            "releaseDate": item.get("release_date") or item.get("first_air_date", ""),
            "rating": round(item.get("vote_average", 0), 1),
            "voteCount": item.get("vote_count", 0),
            "popularity": item.get("popularity", 0),
            "language": item.get("original_language", "en"),
            "genres": genres,
            "genreIds": genre_ids,
            "isMovie": media_type != "tv" and "first_air_date" not in item,
            "mediaType": media_type if "media_type" in item else ("movie" if "title" in item else "tv"),
            "originCountry": item.get("origin_country", []),
        }

    def _normalize_tv(self, item: dict) -> dict:
        """Normalize a TV series item."""
        genre_ids = item.get("genre_ids", [])
        genres = [TV_GENRES.get(gid, f"Unknown({gid})") for gid in genre_ids]

        return {
            "tmdbId": item.get("id"),
            "title": item.get("name") or item.get("original_name", "Unknown"),
            "overview": item.get("overview", ""),
            "posterPath": item.get("poster_path", ""),
            "backdropPath": item.get("backdrop_path", ""),
            "releaseDate": item.get("first_air_date", ""),
            "rating": round(item.get("vote_average", 0), 1),
            "voteCount": item.get("vote_count", 0),
            "popularity": item.get("popularity", 0),
            "language": item.get("original_language", "en"),
            "genres": genres,
            "genreIds": genre_ids,
            "isMovie": False,
            "mediaType": "tv",
            "originCountry": item.get("origin_country", []),
        }

    # ─── DISCOVER (Browse with Filters) ──────────────────────────────────────

    async def discover_movies(
        self,
        page: int = 1,
        sort_by: str = "popularity.desc",
        with_genres: Optional[str] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        rating_min: Optional[float] = None,
        rating_max: Optional[float] = None,
        with_original_language: Optional[str] = None,
    ) -> dict:
        """Discover movies with filters."""
        params = {"page": page, "sort_by": sort_by}

        if with_genres:
            params["with_genres"] = with_genres
        if year_from:
            params["primary_release_date.gte"] = f"{year_from}-01-01"
        if year_to:
            params["primary_release_date.lte"] = f"{year_to}-12-31"
        if rating_min is not None:
            params["vote_average.gte"] = rating_min
        if rating_max is not None:
            params["vote_average.lte"] = rating_max
        if with_original_language:
            params["with_original_language"] = with_original_language

        data = await self._get("/discover/movie", params)
        results = [self._normalize_movie(m) for m in data.get("results", [])]

        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            # TMDB caps at 500
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    async def discover_tv(
        self,
        page: int = 1,
        sort_by: str = "popularity.desc",
        with_genres: Optional[str] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        rating_min: Optional[float] = None,
        rating_max: Optional[float] = None,
        with_original_language: Optional[str] = None,
    ) -> dict:
        """Discover TV series with filters."""
        params = {"page": page, "sort_by": sort_by}

        if with_genres:
            params["with_genres"] = with_genres
        if year_from:
            params["first_air_date.gte"] = f"{year_from}-01-01"
        if year_to:
            params["first_air_date.lte"] = f"{year_to}-12-31"
        if rating_min is not None:
            params["vote_average.gte"] = rating_min
        if rating_max is not None:
            params["vote_average.lte"] = rating_max
        if with_original_language:
            params["with_original_language"] = with_original_language

        data = await self._get("/discover/tv", params)
        results = [self._normalize_tv(s) for s in data.get("results", [])]

        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    # ─── SEARCH ──────────────────────────────────────────────────────────────

    async def search_multi(self, query: str, page: int = 1) -> dict:
        """Search movies and TV shows."""
        data = await self._get("/search/multi", {"query": query, "page": page})
        results = []
        for item in data.get("results", []):
            media_type = item.get("media_type", "movie")
            if media_type == "movie":
                results.append(self._normalize_movie(item))
            elif media_type == "tv":
                results.append(self._normalize_tv(item))
            # Skip 'person' results

        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    async def search_movies(self, query: str, page: int = 1) -> dict:
        """Search only movies."""
        data = await self._get("/search/movie", {"query": query, "page": page})
        results = [self._normalize_movie(m) for m in data.get("results", [])]
        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    async def search_tv(self, query: str, page: int = 1) -> dict:
        """Search only TV series."""
        data = await self._get("/search/tv", {"query": query, "page": page})
        results = [self._normalize_tv(s) for s in data.get("results", [])]
        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    # ─── TRENDING ────────────────────────────────────────────────────────────

    async def get_trending(self, media_type: str = "movie", time_window: str = "week", page: int = 1) -> dict:
        """Get trending movies or TV."""
        data = await self._get(f"/trending/{media_type}/{time_window}", {"page": page})
        normalizer = self._normalize_movie if media_type == "movie" else self._normalize_tv
        results = [normalizer(item) for item in data.get("results", [])]
        return {
            "results": results,
            "totalResults": data.get("total_results", 0),
            "totalPages": min(data.get("total_pages", 1), 500),
            "currentPage": data.get("page", 1),
        }

    # ─── GENRE LISTS ─────────────────────────────────────────────────────────

    async def get_movie_genres(self) -> list:
        """Get movie genre list."""
        data = await self._get("/genre/movie/list")
        return data.get("genres", [])

    async def get_tv_genres(self) -> list:
        """Get TV genre list."""
        data = await self._get("/genre/tv/list")
        return data.get("genres", [])

    # ─── DETAIL ──────────────────────────────────────────────────────────────

    async def get_movie_detail(self, tmdb_id: int) -> dict:
        """Get movie details."""
        data = await self._get(f"/movie/{tmdb_id}", {"append_to_response": "credits,similar,videos"})
        return data

    async def get_tv_detail(self, tmdb_id: int) -> dict:
        """Get TV series details."""
        data = await self._get(f"/tv/{tmdb_id}", {"append_to_response": "credits,similar,videos"})
        return data

    async def get_tv_season_detail(self, tmdb_id: int, season_number: int) -> dict:
        """Get TV season details."""
        data = await self._get(f"/tv/{tmdb_id}/season/{season_number}")
        return data

    async def get_person_credits(self, person_id: int) -> dict:
        """Get combined movie and TV credits for a person."""
        import asyncio
        # Fetch both combined credits and person bio details in parallel to cut response time in half
        tasks = [
            self._get(f"/person/{person_id}/combined_credits"),
            self._get(f"/person/{person_id}")
        ]
        data, person_details = await asyncio.gather(*tasks)
        
        # Normalize and filter
        cast_list = data.get("cast", [])
        results = []
        seen_ids = set()
        for item in cast_list:
            media_type = item.get("media_type")
            if media_type == "movie":
                norm = self._normalize_movie(item)
                if norm["tmdbId"] not in seen_ids:
                    results.append(norm)
                    seen_ids.add(norm["tmdbId"])
            elif media_type == "tv":
                norm = self._normalize_tv(item)
                if norm["tmdbId"] not in seen_ids:
                    results.append(norm)
                    seen_ids.add(norm["tmdbId"])
                    
        # Sort by popularity desc
        results.sort(key=lambda x: x.get("popularity", 0), reverse=True)
        
        return {
            "person": {
                "id": person_details.get("id"),
                "name": person_details.get("name"),
                "biography": person_details.get("biography", ""),
                "profilePath": person_details.get("profile_path", ""),
                "placeOfBirth": person_details.get("place_of_birth", ""),
                "birthday": person_details.get("birthday", ""),
            },
            "results": results
        }

    async def close(self):
        await self.client.aclose()


external_api = ExternalAPIService()
