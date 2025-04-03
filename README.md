# 🎵 Rhythm Radar

## Deploying Soon 🚀

A sleek, modern dashboard that visualizes your Spotify listening habits and music personality. Discover insights about your favorite artists, tracks, and listening patterns in real-time.

![Rhythm Radar login](https://i.imgur.com/htSfdtf.png)
![Rhythm Radar Dashboard](https://i.imgur.com/uBVp5Cd.png)

## ✨ Features

- **Now Playing** - Real-time display of your currently playing track with progress bar
- **Top Artists** - Discover who you listen to most across different time periods
- **Top Tracks** - Explore your most-played songs with audio previews
- **Listening Stats** - Visualize your music habits, genre preferences, and artist loyalty
- **Audio Previews** - Listen to 30-second previews directly in the app

## 🚀 Technologies

### Frontend

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

### Backend

- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Spotipy](https://spotipy.readthedocs.io/) - Python client for Spotify API

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
