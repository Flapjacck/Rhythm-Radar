from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# Create router
router = APIRouter(tags=["authentication"])

# Setup Spotify OAuth object with expanded scopes
sp_oauth = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope = (
    "user-read-private "
    "user-top-read "
    "user-read-recently-played "
    "user-library-read "          # Access saved tracks/albums
    "user-read-playback-state "   # Read playback state
    "playlist-read-private "      # Read private playlists
    "user-read-currently-playing "# What they're listening to right now
    "user-follow-read"            # See who they follow
    ),
    show_dialog=True,
    cache_handler=None  # We'll handle token storage ourselves
)

# Session storage (would use a database in production)
token_storage = {}

# Step 1: Redirect user to Spotify login
@router.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

# Step 2: Handle Spotify redirect and get token
@router.get("/callback")
def callback(code: str):
    print("Received code:", code)
    token_info = sp_oauth.get_access_token(code, check_cache=False)

    if not token_info or "access_token" not in token_info:
        return JSONResponse(status_code=400, content={"error": "Token exchange failed"})

    # Store token info with some identifier
    token_storage["current_token"] = token_info
    return JSONResponse(token_info)

# Helper function to get a valid Spotify client
def get_spotify_client():
    from spotipy import Spotify
    
    # In a real app, find token based on user session/auth
    token_info = token_storage.get("current_token")
    
    if not token_info:
        raise HTTPException(status_code=401, detail="No token found. Please authenticate.")
    
    # Check if token needs refresh
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        token_storage["current_token"] = token_info
    
    return Spotify(auth=token_info['access_token'])