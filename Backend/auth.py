# Replace the token storage in Backend/auth.py:
from db import store_token, get_token, add_used_code, is_code_used, cleanup_old_codes, init_db

# Initialize the database when the app starts
init_db()

# Then replace the relevant code in @router.get("/callback") with:
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
        return JSONResponse(token_info)
        
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

# Also update the get_spotify_client function:
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