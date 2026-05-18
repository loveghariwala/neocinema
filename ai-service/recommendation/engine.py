from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from utils.db import get_db
from bson import ObjectId


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
        movies = await database.movies.find({}).to_list(length=1000)

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
            return []

        target_embedding = self.cached_embeddings[idx].reshape(1, -1)
        similarities = cosine_similarity(
            target_embedding, self.cached_embeddings)[0]

        # Sort by similarity
        related_indices = np.argsort(similarities)[::-1][1:limit+1]

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
