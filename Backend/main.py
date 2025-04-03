from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routers
from auth import router as auth_router
from music_stats import router as music_stats_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(title="Rhythm Radar API")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(music_stats_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Rhythm Radar API. Use /login to authenticate with Spotify."}

# Run with: uvicorn main:app --reload