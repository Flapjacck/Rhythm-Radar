export interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

export interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  artists: Array<{ name: string; id: string }>;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface ListeningStats {
  recent_count: number;
  short_term_genres: string[];
  medium_term_genres: string[];
  long_term_genres: string[];
  trend: {
    new_discoveries: Array<{ id: string; name: string }>;
    consistent_favorites: Array<{ id: string; name: string }>;
  };
}

export interface NowPlaying {
  is_playing: boolean;
  track?: {
    id: string;
    name: string;
    artists: Array<{ name: string; id: string }>;
    album: {
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    preview_url: string | null;
    external_urls: { spotify: string };
    progress_ms: number;
    duration_ms: number;
  };
}

export interface PlaylistData {
  playlist: {
    id: string;
    name: string;
    description: string;
    owner: string;
    images: Array<{ url: string; height: number; width: number }>;
    tracks_total: number;
  };
  tracks: Array<{
    id: string;
    name: string;
    artists: Array<{ name: string; id: string }>;
    album: {
      name: string;
      images: Array<{ url: string; height: number; width: number }>;
    };
    duration_ms: number;
    preview_url: string | null;
  }>;
}
