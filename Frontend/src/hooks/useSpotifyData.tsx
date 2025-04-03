import { useState, useEffect } from "react";
import {
  Artist,
  Track,
  ListeningStats,
  NowPlaying,
  PlaylistData,
} from "../types/spotify";

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

export function useNowPlaying(
  pollingInterval = 10000 // Poll every 10 seconds by default
): ApiResponse<NowPlaying> {
  const [state, setState] = useState<ApiResponse<NowPlaying>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/now-playing");
        const data = await response.json();

        if (response.ok) {
          setState({ data, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: data.error || "Failed to fetch currently playing track",
          });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: "Network error" });
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, pollingInterval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return state;
}

export function usePlaylistTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPlaylist = async (playlistInput: string) => {
    setIsLoading(true);
    setError(null);
    setPlaylistData(null);
    setSelectedTracks(new Set());
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/playlist/fetch?playlist_input=${encodeURIComponent(
          playlistInput
        )}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch playlist");
      }

      setPlaylistData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(trackId)) {
      newSelected.delete(trackId);
    } else {
      newSelected.add(trackId);
    }
    setSelectedTracks(newSelected);
  };

  const createPlaylist = async (name: string, description?: string) => {
    if (!selectedTracks.size) {
      setError("Please select at least one track");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Step 1: Create a new playlist
      const createResponse = await fetch(
        "http://localhost:8000/api/playlist/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: description || "Created with Rhythm Radar",
            public: false,
          }),
        }
      );

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create playlist");
      }

      // Step 2: Add selected tracks to the playlist
      const trackIdsArray = Array.from(selectedTracks);
      const addTracksResponse = await fetch(
        "http://localhost:8000/api/playlist/add-tracks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlist_id: createData.id,
            track_ids: trackIdsArray,
          }),
        }
      );

      const addTracksData = await addTracksResponse.json();
      if (!addTracksResponse.ok) {
        throw new Error(
          addTracksData.error || "Failed to add tracks to playlist"
        );
      }

      setSuccessMessage(
        `Successfully created playlist "${name}" with ${selectedTracks.size} tracks! 🎉`
      );

      // Return the playlist URL for opening in Spotify
      return createData.external_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const selectAllTracks = () => {
    if (!playlistData) return;
    const allTrackIds = new Set(playlistData.tracks.map((track) => track.id));
    setSelectedTracks(allTrackIds);
  };

  const clearSelection = () => {
    setSelectedTracks(new Set());
  };

  return {
    isLoading,
    error,
    playlistData,
    selectedTracks,
    successMessage,
    fetchPlaylist,
    toggleTrackSelection,
    createPlaylist,
    selectAllTracks,
    clearSelection,
  };
}
