from fastapi import APIRouter, Depends, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from auth import get_spotify_client
from typing import List, Optional
from pydantic import BaseModel
import re
import json

router = APIRouter(
    prefix="/api/playlist",
    tags=["playlist_tool"]
)

# Regex pattern to extract playlist ID from Spotify URL
PLAYLIST_URL_PATTERN = r'playlist/([a-zA-Z0-9]+)'

def extract_playlist_id(playlist_input: str) -> str:
    """Extract playlist ID from either a URL or direct ID"""
    # Check if input is a URL
    match = re.search(PLAYLIST_URL_PATTERN, playlist_input)
    if match:
        return match.group(1)
    # Otherwise assume it's already an ID
    return playlist_input

@router.get("/fetch")
def fetch_playlist(playlist_input: str):
    """
    Fetch all tracks from a playlist
    playlist_input can be a URL or playlist ID
    """
    try:
        sp = get_spotify_client()
        playlist_id = extract_playlist_id(playlist_input)
        
        # Get playlist metadata
        playlist = sp.playlist(playlist_id)
        
        # Prepare to collect all tracks
        tracks = []
        results = sp.playlist_items(playlist_id, limit=100)
        
        # Process first batch
        for item in results['items']:
            if item['track']:
                track = item['track']
                tracks.append({
                    'id': track['id'],
                    'name': track['name'],
                    'artists': [{'name': artist['name'], 'id': artist['id']} for artist in track['artists']],
                    'album': {
                        'name': track['album']['name'],
                        'images': track['album']['images']
                    },
                    'duration_ms': track['duration_ms'],
                    'preview_url': track['preview_url']
                })
        
        # Get remaining tracks if needed (pagination)
        while results['next']:
            results = sp.next(results)
            for item in results['items']:
                if item['track']:
                    track = item['track']
                    tracks.append({
                        'id': track['id'],
                        'name': track['name'],
                        'artists': [{'name': artist['name'], 'id': artist['id']} for artist in track['artists']],
                        'album': {
                            'name': track['album']['name'],
                            'images': track['album']['images']
                        },
                        'duration_ms': track['duration_ms'],
                        'preview_url': track['preview_url']
                    })
        
        # Return both playlist metadata and tracks
        return {
            'playlist': {
                'id': playlist['id'],
                'name': playlist['name'],
                'description': playlist['description'],
                'owner': playlist['owner']['display_name'],
                'images': playlist['images'],
                'tracks_total': playlist['tracks']['total']
            },
            'tracks': tracks
        }
        
    except Exception as e:
        error_msg = str(e)
        # Handle case where error might be a dict
        if hasattr(e, '__dict__'):
            try:
                error_msg = json.dumps(e.__dict__)
            except:
                error_msg = "Error serializing exception"
    
    return JSONResponse(
        status_code=500, 
        content={"error": f"Failed to fetch top artists: {error_msg}"}
    )

@router.get("/user-playlists")
def get_user_playlists(limit: int = 50):
    """
    Get the current user's playlists for selection
    """
    try:
        sp = get_spotify_client()
        
        # Get current user's playlists
        results = sp.current_user_playlists(limit=limit)
        
        # Format the response
        playlists = []
        for item in results['items']:
            # Only include playlists that the user owns and can modify
            if item['owner']['id'] == sp.current_user()['id']:
                playlists.append({
                    'id': item['id'],
                    'name': item['name'],
                    'description': item.get('description', ''),
                    'tracks_total': item['tracks']['total'],
                    'images': item['images']
                })
        
        return {'playlists': playlists}
        
    except Exception as e:
        error_msg = str(e)
        # Handle case where error might be a dict
        if hasattr(e, '__dict__'):
            try:
                error_msg = json.dumps(e.__dict__)
            except:
                error_msg = "Error serializing exception"
    
    return JSONResponse(
        status_code=500, 
        content={"error": f"Failed to fetch user playlists: {error_msg}"}
    )

# Define Pydantic models for request bodies
class PlaylistCreate(BaseModel):
    name: str
    description: Optional[str] = "Created with Rhythm Radar"
    public: bool = False

class AddTracks(BaseModel):
    playlist_id: str
    track_ids: List[str]

@router.post("/create")
def create_playlist(playlist_data: PlaylistCreate):
    """
    Create a new empty playlist for the current user
    """
    try:
        sp = get_spotify_client()
        
        # Get the current user's ID
        user_info = sp.current_user()
        user_id = user_info['id']
        
        # Create new playlist
        playlist = sp.user_playlist_create(
            user=user_id,
            name=playlist_data.name,
            public=playlist_data.public,
            description=playlist_data.description
        )
        
        return {
            'id': playlist['id'],
            'name': playlist['name'],
            'external_url': playlist['external_urls']['spotify']
        }
        
    except Exception as e:
        error_msg = str(e)
        # Handle case where error might be a dict
        if hasattr(e, '__dict__'):
            try:
                error_msg = json.dumps(e.__dict__)
            except:
                error_msg = "Error serializing exception"
    
    return JSONResponse(
        status_code=500, 
        content={"error": f"Failed to fetch top artists: {error_msg}"}
    )

@router.post("/add-tracks")
def add_tracks(track_data: AddTracks):
    """
    Add selected tracks to a playlist
    """
    try:
        sp = get_spotify_client()
        
        # Format track IDs as required by Spotify API
        track_uris = [f"spotify:track:{track_id}" for track_id in track_data.track_ids]
        
        # Add tracks to playlist (max 100 at a time)
        for i in range(0, len(track_uris), 100):
            batch = track_uris[i:i+100]
            sp.playlist_add_items(track_data.playlist_id, batch)
        
        # Get playlist info to return
        playlist = sp.playlist(track_data.playlist_id)
        
        return {
            'success': True,
            'message': f"{len(track_data.track_ids)} tracks added to playlist",
            'playlist_id': track_data.playlist_id,
            'playlist_name': playlist['name'],
            'external_url': playlist['external_urls']['spotify']
        }
        
    except Exception as e:
        error_msg = str(e)
        # Handle case where error might be a dict
        if hasattr(e, '__dict__'):
            try:
                error_msg = json.dumps(e.__dict__)
            except:
                error_msg = "Error serializing exception"
    
    return JSONResponse(
        status_code=500, 
        content={"error": f"Failed to add tracks: {error_msg}"}
    )