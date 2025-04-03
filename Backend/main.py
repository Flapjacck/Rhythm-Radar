from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from spotipy.oauth2 import SpotifyOAuth
from spotipy import Spotify
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# Setup Spotify OAuth object with expanded scopes
sp_oauth = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="user-read-private user-top-read user-read-recently-played",
    show_dialog=True,
    cache_handler=None  # We'll handle token storage ourselves
)

# Session storage (would use a database in production)
token_storage = {}

# Step 1: Redirect user to Spotify login
@app.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

# Step 2: Handle Spotify redirect and get token
@app.get("/callback")
def callback(code: str):
    print("Received code:", code)
    token_info = sp_oauth.get_access_token(code, check_cache=False)

    if not token_info or "access_token" not in token_info:
        return JSONResponse(status_code=400, content={"error": "Token exchange failed"})

    # Store token info with some identifier (for a real app, use proper session management)
    # Here we're using a simple in-memory storage
    token_storage["current_token"] = token_info

    return JSONResponse(token_info)

# Helper function to get a valid Spotify client
def get_spotify_client(token: str = None):
    # In a real app, find token based on user session/auth
    token_info = token_storage.get("current_token")
    
    if not token_info:
        raise HTTPException(status_code=401, detail="No token found. Please authenticate.")
    
    # Check if token needs refresh
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        token_storage["current_token"] = token_info
    
    return Spotify(auth=token_info['access_token'])

# Get user's top artists
@app.get("/api/top-artists")
def top_artists(time_range: str = "medium_term", limit: int = 10):
    """
    Get user's top artists
    time_range: short_term (4 weeks), medium_term (6 months), long_term (years)
    """
    try:
        sp = get_spotify_client()
        results = sp.current_user_top_artists(time_range=time_range, limit=limit)
        
        # Format the response
        artists = []
        for artist in results['items']:
            artists.append({
                'id': artist['id'],
                'name': artist['name'],
                'popularity': artist['popularity'],
                'genres': artist['genres'],
                'images': artist['images'],
                'external_urls': artist['external_urls']
            })
        
        return {'artists': artists}
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": f"Failed to fetch top artists: {str(e)}"}
        )

# Get user's top tracks
@app.get("/api/top-tracks")
def top_tracks(time_range: str = "medium_term", limit: int = 10):
    """
    Get user's top tracks
    time_range: short_term (4 weeks), medium_term (6 months), long_term (years)
    """
    try:
        sp = get_spotify_client()
        results = sp.current_user_top_tracks(time_range=time_range, limit=limit)
        
        # Format the response
        tracks = []
        for track in results['items']:
            tracks.append({
                'id': track['id'],
                'name': track['name'],
                'album': {
                    'name': track['album']['name'],
                    'images': track['album']['images']
                },
                'artists': [{'name': artist['name'], 'id': artist['id']} for artist in track['artists']],
                'popularity': track['popularity'],
                'preview_url': track['preview_url'],
                'external_urls': track['external_urls']
            })
        
        return {'tracks': tracks}
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": f"Failed to fetch top tracks: {str(e)}"}
        )

# Get user's listening statistics
@app.get("/api/listening-stats")
def listening_stats():
    """Get user's listening statistics and recent trends"""
    try:
        sp = get_spotify_client()
        
        # Get recently played tracks
        recent_tracks = sp.current_user_recently_played(limit=50)
        
        # Get top artists for different time ranges
        short_term = sp.current_user_top_artists(time_range="short_term", limit=5)
        medium_term = sp.current_user_top_artists(time_range="medium_term", limit=5)
        long_term = sp.current_user_top_artists(time_range="long_term", limit=5)
        
        # Simple processing - in a real app you'd do more analysis
        stats = {
            "recent_count": len(recent_tracks["items"]),
            "short_term_genres": _extract_top_genres(short_term),
            "medium_term_genres": _extract_top_genres(medium_term),
            "long_term_genres": _extract_top_genres(long_term),
            "trend": _compare_artist_trends(short_term, medium_term, long_term)
        }
        
        return stats
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": f"Failed to fetch listening stats: {str(e)}"}
        )

# Helper function for genre extraction
def _extract_top_genres(artist_data):
    all_genres = []
    for artist in artist_data["items"]:
        all_genres.extend(artist["genres"])
    
    # Count genres and find most common
    genre_count = {}
    for genre in all_genres:
        if genre in genre_count:
            genre_count[genre] += 1
        else:
            genre_count[genre] = 1
    
    # Sort by count
    sorted_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)
    return [genre[0] for genre in sorted_genres[:5]]

# Helper function to compare artist trends
def _compare_artist_trends(short_term, medium_term, long_term):
    # Get IDs of top artists in each time range
    short_ids = [artist["id"] for artist in short_term["items"]]
    medium_ids = [artist["id"] for artist in medium_term["items"]]
    long_ids = [artist["id"] for artist in long_term["items"]]
    
    # Find new artists (in short term but not medium term)
    new_artists = [
        {"id": artist["id"], "name": artist["name"]}
        for artist in short_term["items"]
        if artist["id"] not in medium_ids and artist["id"] not in long_ids
    ]
    
    # Find consistent favorites (in all time ranges)
    consistent = [
        {"id": artist["id"], "name": artist["name"]}
        for artist in short_term["items"]
        if artist["id"] in medium_ids and artist["id"] in long_ids
    ]
    
    return {
        "new_discoveries": new_artists,
        "consistent_favorites": consistent
    }