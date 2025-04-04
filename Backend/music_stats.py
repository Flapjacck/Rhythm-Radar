from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from auth import get_spotify_client
import json

router = APIRouter(
    prefix="/api",
    tags=["music_stats"]
)

# Get user's top artists
@router.get("/top-artists")
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

# Get user's top tracks
@router.get("/top-tracks")
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
        error_msg = str(e)
        # Handle case where error might be a dict
        if hasattr(e, '__dict__'):
            try:
                error_msg = json.dumps(e.__dict__)
            except:
                error_msg = "Error serializing exception"
    
    return JSONResponse(
        status_code=500, 
        content={"error": f"Failed to fetch top tracks: {error_msg}"}
    )

# Get user's listening statistics
@router.get("/listening-stats")
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
        
        # Process data
        stats = {
            "recent_count": len(recent_tracks["items"]),
            "short_term_genres": _extract_top_genres(short_term),
            "medium_term_genres": _extract_top_genres(medium_term),
            "long_term_genres": _extract_top_genres(long_term),
            "trend": _compare_artist_trends(short_term, medium_term, long_term)
        }
        
        return stats
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
        content={"error": f"Failed to fetch stats: {error_msg}"}
    )

# Helper functions for data processing
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

# Get user's currently playing track
@router.get("/now-playing")
def get_now_playing():
    """Get user's currently playing track"""
    try:
        sp = get_spotify_client()
        current = sp.current_playback()
        
        if current and current.get('item'):
            return {
                'is_playing': current['is_playing'],
                'track': {
                    'id': current['item']['id'],
                    'name': current['item']['name'],
                    'artists': [{'name': artist['name'], 'id': artist['id']} for artist in current['item']['artists']],
                    'album': {
                        'name': current['item']['album']['name'],
                        'images': current['item']['album']['images']
                    },
                    'preview_url': current['item'].get('preview_url'),
                    'external_urls': current['item']['external_urls'],
                    'progress_ms': current.get('progress_ms'),
                    'duration_ms': current['item']['duration_ms']
                }
            }
        return {'is_playing': False}
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
        content={"error": f"Failed to fetch now playing: {error_msg}"}
    )