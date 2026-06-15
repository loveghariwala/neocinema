from fastapi import APIRouter, HTTPException, Query
from models.schemas import RecommendationResponse
from recommendation.engine import engine
from services.browse_service import browse_service
from services.external_api import external_api, _cache
from typing import Optional
import time

router = APIRouter()


# ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────

@router.get("/recommend/{movie_id}", response_model=RecommendationResponse)
async def get_recommendations(movie_id: str, limit: int = 10):
    recs = await engine.get_recommendations(movie_id, limit)
    # Return empty recommendations instead of triggering an expensive full re-index
    return {"movie_id": movie_id, "recommendations": recs}


@router.post("/reindex")
async def reindex():
    count = await engine.generate_movie_embeddings()
    return {"message": f"Successfully reindexed {count} movies"}


# ─── EXTERNAL API: DISCOVER (Movies) ─────────────────────────────────────────

@router.get("/discover/movies")
async def discover_movies(
    page: int = Query(1, ge=1),
    sort_by: str = Query("popularity.desc"),
    with_genres: Optional[str] = Query(None, description="Comma-separated genre IDs"),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    rating_min: Optional[float] = Query(None),
    rating_max: Optional[float] = Query(None),
    language: Optional[str] = Query(None, description="ISO 639-1 language code"),
):
    """Discover movies from global catalog with filters, sorting, pagination."""
    try:
        data = await external_api.discover_movies(
            page=page,
            sort_by=sort_by,
            with_genres=with_genres,
            year_from=year_from,
            year_to=year_to,
            rating_min=rating_min,
            rating_max=rating_max,
            with_original_language=language,
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── EXTERNAL API: DISCOVER (TV Series) ──────────────────────────────────────

@router.get("/discover/series")
async def discover_series(
    page: int = Query(1, ge=1),
    sort_by: str = Query("popularity.desc"),
    with_genres: Optional[str] = Query(None, description="Comma-separated genre IDs"),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    rating_min: Optional[float] = Query(None),
    rating_max: Optional[float] = Query(None),
    language: Optional[str] = Query(None, description="ISO 639-1 language code"),
):
    """Discover TV series from global catalog with filters, sorting, pagination."""
    try:
        data = await external_api.discover_tv(
            page=page,
            sort_by=sort_by,
            with_genres=with_genres,
            year_from=year_from,
            year_to=year_to,
            rating_min=rating_min,
            rating_max=rating_max,
            with_original_language=language,
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── EXTERNAL API: SEARCH ────────────────────────────────────────────────────

@router.get("/search")
async def search_content(
    query: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    type: Optional[str] = Query(None, description="Filter: movie, tv, or all"),
):
    """Search movies and TV series globally."""
    try:
        if type == "movie":
            data = await external_api.search_movies(query, page)
        elif type == "tv":
            data = await external_api.search_tv(query, page)
        else:
            data = await external_api.search_multi(query, page)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── EXTERNAL API: TRENDING ──────────────────────────────────────────────────

@router.get("/trending/{media_type}")
async def get_trending(
    media_type: str = "movie",
    time_window: str = Query("week", description="day or week"),
    page: int = Query(1, ge=1),
):
    """Get trending movies or series."""
    if media_type not in ("movie", "tv", "all"):
        raise HTTPException(status_code=400, detail="media_type must be 'movie', 'tv', or 'all'")
    try:
        data = await external_api.get_trending(media_type, time_window, page)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── EXTERNAL API: GENRE LISTS ───────────────────────────────────────────────

@router.get("/genres/movie")
async def get_movie_genres():
    """Get list of movie genres with IDs."""
    try:
        genres = await external_api.get_movie_genres()
        return {"genres": genres}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/genres/tv")
async def get_tv_genres():
    """Get list of TV genres with IDs."""
    try:
        genres = await external_api.get_tv_genres()
        return {"genres": genres}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── EXTERNAL API: DETAILS ──────────────────────────────────────────────────

@router.get("/movie/{tmdb_id}")
async def get_movie_detail(tmdb_id: int):
    """Get movie details from external API."""
    try:
        return await external_api.get_movie_detail(tmdb_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tv/{tmdb_id}")
async def get_tv_detail(tmdb_id: int):
    """Get TV series details from external API."""
    try:
        return await external_api.get_tv_detail(tmdb_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tv/{tmdb_id}/season/{season_number}")
async def get_tv_season_detail(tmdb_id: int, season_number: int):
    """Get TV season details from external API."""
    try:
        return await external_api.get_tv_season_detail(tmdb_id, season_number)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/person/{person_id}")
async def get_person_detail(person_id: int):
    """Get person details and combined movie/TV credits from external API."""
    try:
        return await external_api.get_person_credits(person_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── LOCAL DB: BROWSE (Legacy) ────────────────────────────────────────────────

@router.get("/browse")
async def browse_content(
    is_movie: bool = Query(True),
    genres: Optional[str] = Query(None),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    rating_min: Optional[float] = Query(None),
    rating_max: Optional[float] = Query(None),
    sort_by: str = Query("popularity"),
    sort_order: str = Query("desc"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    """Legacy browse endpoint using local MongoDB."""
    genre_list = [g.strip() for g in genres.split(",")] if genres else None
    data = await browse_service.browse(
        is_movie=is_movie, genres=genre_list, year_from=year_from, year_to=year_to,
        rating_min=rating_min, rating_max=rating_max, sort_by=sort_by, sort_order=sort_order,
        search_query=search, page=page, limit=limit,
    )
    return data


@router.get("/filters")
async def get_filter_options(is_movie: bool = Query(True)):
    """Get filter options from local DB."""
    options = await browse_service.get_filter_options(is_movie=is_movie)
    return options


# ─── CACHE DIAGNOSTICS ───────────────────────────────────────────────────────

@router.get("/cache-status")
async def cache_status():
    """Return in-memory cache stats."""
    now = time.time()
    active = sum(1 for _, (exp, _) in _cache.items() if exp > now)
    expired = len(_cache) - active
    return {
        "total_entries": len(_cache),
        "active_entries": active,
        "expired_entries": expired,
    }
