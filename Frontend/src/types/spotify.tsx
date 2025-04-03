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
