import os

# Suppress HuggingFace Hub unauthenticated request warnings
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from utils.db import close_db
import uvicorn

app = FastAPI(title="NeoCinema AI Service")

# Load allowed origins from environment variable, fallback to default lists
allowed_origins = [
    "http://localhost:3000",
    "https://aggregately-legendary-nettie.ngrok-free.dev",
    "https://neocinematv.vercel.app"
]
env_origins = os.environ.get("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/ai")


@app.on_event("shutdown")
async def shutdown_event():
    await close_db()


@app.get("/")
def home():
    return {"message": "NeoCinema AI Service is running"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
