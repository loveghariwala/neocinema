from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from utils.db import get_db
from bson import ObjectId
import re


def clean_title(title: str) -> str:
    return title.lower().strip()


def get_title_base(title: str) -> str:
    t = clean_title(title)

    # 1. Split on colons or dashes (e.g. "Dune: Part Two" -> "Dune")
    for separator in [':', ' - ']:
        if separator in t:
            parts = t.split(separator)
            if parts[0].strip():
                return parts[0].strip()

    # 2. Strip Roman numerals or digits at the end
    t_no_num = re.sub(r'\s+(?:[0-9]+|v?i{0,3}|i?x|x?i{0,3})$', '', t)

    # 3. Strip common franchise words like "part", "volume", "vol", "chapter"
    t_no_words = re.sub(
        r'\s+(?:part|volume|vol\.?|chapter)\s*(?:[0-9]+|v?i{0,3}|i?x|x?i{0,3})?$', '', t_no_num)

    return t_no_words.strip()


class RecommendationEngine:
    def __init__(self):
        self._model = None
        self.cached_embeddings = None
        self.movie_ids = []

    @property
    def model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
        return self._model

    async def generate_movie_embeddings(self):
        database = await get_db()
        movies = await database.movies.find({}).to_list(length=10000)

        texts = [
            f"{m.get('title', '')} {m.get('overview', '')} {' '.join(m.get('genres', []))}" for m in movies]
        embeddings = self.model.encode(texts)

        self.cached_embeddings = embeddings
        self.movie_ids = [str(m['_id']) for m in movies]
        self.movies_data = movies

        return len(movies)

    async def get_recommendations(self, movie_id: str, limit: int = 10):
        if self.cached_embeddings is None:
            await self.generate_movie_embeddings()

        try:
            idx = self.movie_ids.index(movie_id)
        except ValueError:
            # If not found in ObjectId list, try searching by TMDB ID
            idx = -1
            for i, m in enumerate(self.movies_data):
                if str(m.get('tmdbId', '')) == movie_id:
                    idx = i
                    break
            if idx == -1:
                return []

        target_movie = self.movies_data[idx]
        target_title = target_movie.get('title', '')
        target_base = get_title_base(target_title)

        target_embedding = self.cached_embeddings[idx].reshape(1, -1)
        similarities = cosine_similarity(
            target_embedding, self.cached_embeddings)[0]

        sequel_indices = []
        other_indices = []

        for i in range(len(self.movies_data)):
            if i == idx:
                continue

            movie = self.movies_data[i]
            title = movie.get('title', '')

            is_seq = False
            if len(target_base) >= 3:
                base = get_title_base(title)
                if base == target_base:
                    is_seq = True

            if is_seq:
                sequel_indices.append((i, similarities[i]))
            else:
                other_indices.append((i, similarities[i]))

        # Sort both lists by similarity score desc
        sequel_indices.sort(key=lambda x: x[1], reverse=True)
        other_indices.sort(key=lambda x: x[1], reverse=True)

        # Combine: sequels first, then others
        combined = sequel_indices + other_indices
        related_indices = [item[0] for item in combined[:limit]]

        recommendations = []
        for i in related_indices:
            movie = self.movies_data[i]
            recommendations.append({
                "id": str(movie['_id']),
                "tmdbId": movie['tmdbId'],
                "title": movie['title'],
                "score": float(similarities[i])
            })

        return recommendations


engine = RecommendationEngine()
