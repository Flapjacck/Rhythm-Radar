import os
import json
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Create a connection to the PostgreSQL database"""
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.autocommit = True
    return conn

def init_db():
    """Initialize database tables if they don't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tokens table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tokens (
        user_id VARCHAR(255) PRIMARY KEY,
        token_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Create used_codes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS used_codes (
        code VARCHAR(255) PRIMARY KEY,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    cursor.close()
    conn.close()

# Functions for token storage
def store_token(user_id, token_info):
    """Store a token in the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO tokens (user_id, token_data)
        VALUES (%s, %s)
        ON CONFLICT (user_id) 
        DO UPDATE SET token_data = %s, updated_at = CURRENT_TIMESTAMP
        """,
        (user_id, json.dumps(token_info), json.dumps(token_info))
    )
    
    cursor.close()
    conn.close()

def get_token(user_id):
    """Retrieve a token from the database"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT token_data FROM tokens WHERE user_id = %s", (user_id,))
    result = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if result:
        return json.loads(result['token_data'])
    return None

def add_used_code(code):
    """Add a code to the used_codes table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create a hash of the code instead of storing the full code
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    
    cursor.execute("INSERT INTO used_codes (code) VALUES (%s) ON CONFLICT DO NOTHING", (code_hash,))
    
    cursor.close()
    conn.close()

def is_code_used(code):
    """Check if a code has been used before"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create a hash of the code for comparison
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    
    cursor.execute("SELECT 1 FROM used_codes WHERE code = %s", (code_hash,))
    result = cursor.fetchone() is not None
    
    cursor.close()
    conn.close()
    
    return result

def cleanup_old_codes():
    """Remove codes older than 30 days"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM used_codes WHERE used_at < NOW() - INTERVAL '30 days'")
    
    cursor.close()
    conn.close()

