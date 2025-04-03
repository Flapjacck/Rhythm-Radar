from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse, Response
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import time

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
    "playlist-modify-private "    # Create/modify private playlists
    "playlist-modify-public "     # Create/modify public playlists
    "user-read-currently-playing "# What they're listening to right now
    "user-follow-read"            # See who they follow
    ),
    show_dialog=True,
    cache_handler=None  # We'll handle token storage ourselves
)

# Session storage (would use a database in production)
token_storage = {}
used_codes = set()  # Track already used codes

# Step 1: Redirect user to Spotify login
@router.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(auth_url)

# Step 2: Handle Spotify redirect and get token
@router.get("/callback")
def callback(code: str, response: Response):
    print("Received code:", code)
    
    # Check if code was already used
    if code in used_codes:
        print(f"Code {code[:10]}... was already used")
        # Return success anyway to prevent further errors since the site works
        return JSONResponse({
            "access_token": token_storage.get("current_token", {}).get("access_token", ""),
            "token_type": "Bearer",
            "expires_in": 3600,
            "status": "reused_code_but_token_exists"
        })
    
    try:
        # Mark code as used before attempting exchange
        used_codes.add(code)
        
        # Set a max size for the used_codes set to prevent memory issues
        if len(used_codes) > 100:
            # Keep only the 50 most recent codes
            used_codes.clear()
            used_codes.add(code)
            
        token_info = sp_oauth.get_access_token(code, check_cache=False)
        
        if not token_info or "access_token" not in token_info:
            return JSONResponse(status_code=400, content={"error": "Token exchange failed"})
        
        # Store token info with some identifier
        token_storage["current_token"] = token_info
        return JSONResponse(token_info)
    except Exception as e:
        print(f"Error exchanging code for token: {str(e)}")
        
        # Check if we already have a valid token despite the error
        if "current_token" in token_storage and "access_token" in token_storage["current_token"]:
            # We have a token already, so return that instead of an error
            return JSONResponse({
                "access_token": token_storage["current_token"]["access_token"],
                "token_type": "Bearer",
                "status": "using_existing_token"
            })
        
        return JSONResponse(status_code=400, content={"error": f"Token exchange failed: {str(e)}"})

# Helper function to get a valid Spotify client
def get_spotify_client():
    from spotipy import Spotify
    
    # In a real app, find token based on user session/auth
    token_info = token_storage.get("current_token")
    
    if not token_info:
        raise HTTPException(status_code=401, detail="No token found. Please authenticate.")
    
    # Check if token needs refresh - do this BEFORE checking expiry
    # This preemptively refreshes tokens that will expire soon (within 5 minutes)
    now = int(time.time())
    is_token_expired = token_info.get('expires_at', 0) - now < 300  # 5 minutes buffer
    
    if is_token_expired and 'refresh_token' in token_info:
        try:
            print("Refreshing access token")
            token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
            token_storage["current_token"] = token_info
        except Exception as e:
            print(f"Error refreshing token: {e}")
    
    return Spotify(auth=token_info['access_token'])