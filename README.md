# 🎵 Rhythm Radar

## Deploying Soon 🚀

A sleek, modern dashboard that visualizes your Spotify listening habits and music personality. Discover insights about your favorite artists, tracks, and listening patterns in real-time.

![Rhythm Radar login](https://i.imgur.com/htSfdtf.png)
![Rhythm Radar Dashboard](https://i.imgur.com/uBVp5Cd.png)

## ✨ Features

- Real-time music playback tracking
- Personalized artist and track analytics
- Custom playlist creation tool

## 🚀 Technologies

### Frontend

- **React 19**: UI component library (latest version)
- **TypeScript**: Static type checking
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router DOM 7**: Client-side routing
- **Vite**: Next-generation frontend build tool
- **SWC**: Super-fast TypeScript/JavaScript compiler

### Backend

- **FastAPI**: Modern, high-performance web framework for building APIs
- **Uvicorn**: ASGI server implementation for running FastAPI
- **Spotipy**: Python library for the Spotify Web API
- **PostgreSQL**: Database for storing user tokens and session data
- **psycopg2-binary**: PostgreSQL adapter for Python
- **python-dotenv**: Environment variable management
- **python-multipart**: Multipart form data parser

### Deployment Infrastructure

- **Vercel**: Frontend hosting and deployment
- **Render**: Backend API hosting and deployment
- **PostgreSQL**: Database hosting (via Render)

## 📋 Prerequisites

- Node.js (v18+) and npm/yarn
- Python 3.10+

## 🛠️ Setup and Installation

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn spotipy python-dotenv

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🙏 Acknowledgments

- [Spotify API for providing the music data](https://developer.spotify.com/documentation/web-api/)
- [Icons from Heroicons](https://heroicons.com/)
- [Font families from Google Fonts](https://fonts.google.com/)

## Author

- [Spencer Kelly](https://SpencerKelly.tech/)
