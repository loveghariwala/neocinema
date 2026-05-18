from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from utils.db import close_db
import os
import uvicorn

app = FastAPI(title="NeoCinema AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://aggregately-legendary-nettie.ngrok-free.dev",
        "https://neocinematv.vercel.app/"
    ],
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
