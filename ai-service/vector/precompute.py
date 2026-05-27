import asyncio
import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

async def main():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.neocinema
    
    print("Fetching movies...")
    movies = await db.movies.find({}).to_list(length=10000)
    print(f"Fetched {len(movies)} movies.")
    
    if not movies:
        print("No movies found in database!")
        return
        
    print("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Generating texts for encoding...")
    texts = []
    movies_metadata = []
    
    for m in movies:
        title = m.get('title', '')
        overview = m.get('overview', '')
        genres = m.get('genres', [])
        
        texts.append(f"{title} {overview} {' '.join(genres)}")
        
        # Serialize fields, converting ObjectId to string
        movies_metadata.append({
            "_id": str(m['_id']),
            "tmdbId": m.get('tmdbId'),
            "title": title,
            "genres": genres
        })
        
    print("Encoding embeddings (this might take a minute)...")
    embeddings = model.encode(texts)
    
    # Ensure vector directory exists
    os.makedirs("vector", exist_ok=True)
    
    print("Saving files...")
    np.save("vector/embeddings.npy", embeddings)
    
    with open("vector/movies_metadata.json", "w") as f:
        json.dump(movies_metadata, f, indent=2)
        
    print("Precomputation complete! Saved:")
    print("  - vector/embeddings.npy")
    print("  - vector/movies_metadata.json")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
