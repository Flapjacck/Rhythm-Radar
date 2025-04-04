from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse, RedirectResponse
import os
import time
import random
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from db import store_token, get_token, add_used_code, is_code_used, cleanup_old_codes, init_db

# Create the router object
router = APIRouter(
    tags=["authentication"]
)

# Initialize the database when the app starts
init_db()

# Set up Spotify OAuth
SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.environ.get("REDIRECT_URI", "http://localhost:8000/callback")

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="user-top-read user-read-currently-playing playlist-modify-private playlist-read-private user-read-recently-played"
)

# Login endpoint
@router.get("/login")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(url=auth_url)

@router.get("/callback")
def callback(code: str, response: Response):
    print("Received code:", code[:10] + "...")
    
    # Check if code was already used
    if is_code_used(code):
        print(f"Code {code[:10]}... was already used")
        
        # Get current token if it exists
        token_info = get_token("current_token")
        if token_info and "access_token" in token_info:
            return JSONResponse({
                "access_token": token_info["access_token"],
                "token_type": "Bearer",
                "expires_in": 3600,
                "status": "reused_code_but_token_exists"
            })
        else:
            return JSONResponse(status_code=400, content={"error": "Authorization code has already been used"})
    
    try:
        # Mark code as used
        add_used_code(code)
        
        # Clean up old codes occasionally
        if random.random() < 0.05:  # 5% chance to run cleanup
            cleanup_old_codes()
            
        token_info = sp_oauth.get_access_token(code, check_cache=False)
        
        if not token_info or "access_token" not in token_info:
            return JSONResponse(status_code=400, content={"error": "Token exchange failed"})
        
        # Store token info
        store_token("current_token", token_info)
        
        # CHANGE THIS: Instead of returning JSON, redirect to the frontend with token
        frontend_url = os.environ.get("FRONTEND_URL", "https://rhythm-radar-spencer-kellys-projects.vercel.app")
        redirect_url = f"{frontend_url}/callback?token={token_info['access_token']}&expires_in={token_info['expires_in']}"
        
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        print(f"Error exchanging code for token: {str(e)}")
        
        # Check if we already have a valid token
        token_info = get_token("current_token")
        if token_info and "access_token" in token_info:
            return JSONResponse({
                "access_token": token_info["access_token"],
                "token_type": "Bearer",
                "status": "using_existing_token"
            })
        
        return JSONResponse(status_code=400, content={"error": f"Token exchange failed: {str(e)}"})

def get_spotify_client():
    from spotipy import Spotify
    
    # Get token from database 
    token_info = get_token("current_token")
    
    if not token_info:
        raise HTTPException(status_code=401, detail="No token found. Please authenticate.")
    
    # Check if token needs refresh
    now = int(time.time())
    is_token_expired = token_info.get('expires_at', 0) - now < 300  # 5 minutes buffer
    
    if is_token_expired and 'refresh_token' in token_info:
        try:
            print("Refreshing access token")
            token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
            store_token("current_token", token_info)
        except Exception as e:
            print(f"Error refreshing token: {e}")
    
    return Spotify(auth=token_info['access_token'])