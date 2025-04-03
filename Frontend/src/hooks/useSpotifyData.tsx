import { useState, useEffect } from "react";
import { Artist, Track, ListeningStats } from "../types/spotify";

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTopArtists(
  timeRange: string = "medium_term",
  limit: number = 10
): ApiResponse<Artist[]> {
  const [state, setState] = useState<ApiResponse<Artist[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/top-artists?time_range=${timeRange}&limit=${limit}`
        );
        const data = await response.json();

        if (response.ok) {
          setState({ data: data.artists, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: data.error || "Failed to fetch top artists",
          });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: "Network error" });
      }
    };

    fetchData();
  }, [timeRange, limit]);

  return state;
}

export function useTopTracks(
  timeRange: string = "medium_term",
  limit: number = 10
): ApiResponse<Track[]> {
  const [state, setState] = useState<ApiResponse<Track[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/top-tracks?time_range=${timeRange}&limit=${limit}`
        );
        const data = await response.json();

        if (response.ok) {
          setState({ data: data.tracks, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: data.error || "Failed to fetch top tracks",
          });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: "Network error" });
      }
    };

    fetchData();
  }, [timeRange, limit]);

  return state;
}

export function useListeningStats(): ApiResponse<ListeningStats> {
  const [state, setState] = useState<ApiResponse<ListeningStats>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/listening-stats"
        );
        const data = await response.json();

        if (response.ok) {
          setState({ data, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: data.error || "Failed to fetch listening stats",
          });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: "Network error" });
      }
    };

    fetchData();
  }, []);

  return state;
}
