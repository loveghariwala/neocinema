from pydantic import BaseModel
from typing import List, Optional, Any


# ─── RECOMMENDATION SCHEMAS ──────────────────────────────────────────────────

class MovieRecommendation(BaseModel):
    id: str
    tmdbId: int
    title: str
    score: float

class RecommendationResponse(BaseModel):
    movie_id: str
    recommendations: List[MovieRecommendation]

class SearchRequest(BaseModel):
    query: str
    limit: int = 10


# ─── BROWSE / FILTER SCHEMAS ─────────────────────────────────────────────────

class BrowseMovieItem(BaseModel):
    """Single movie/series item in browse results."""
    class Config:
        extra = "allow"

class BrowseResponse(BaseModel):
    """Response from the browse endpoint."""
    results: List[Any]
    totalResults: int
    totalPages: int
    currentPage: int
    limit: int

class YearRange(BaseModel):
    minYear: int
    maxYear: int

class RatingRange(BaseModel):
    minRating: float
    maxRating: float

class FilterOptionsResponse(BaseModel):
    """Available filter options for the browse UI."""
    genres: List[str]
    years: YearRange
    ratings: RatingRange
