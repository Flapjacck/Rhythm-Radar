import { useState, useEffect } from "react";
import Card from "../common/Card";
import { usePlaylistTool } from "../../hooks/useSpotifyData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
interface UserPlaylist {
  id: string;
  name: string;
  description: string;
  tracks_total: number;
  images: Array<{ url: string; height: number; width: number }>;
}

const PlaylistToolCard = () => {
  const [playlistInput, setPlaylistInput] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [createdPlaylistUrl, setCreatedPlaylistUrl] = useState<string | null>(
    null
  );
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [selectedExistingPlaylist, setSelectedExistingPlaylist] =
    useState<string>("");
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [playlistMode, setPlaylistMode] = useState<"new" | "existing">("new");
  const [localSuccessMessage, setLocalSuccessMessage] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
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
  } = usePlaylistTool();

  // Reset local success message when the global one changes
  useEffect(() => {
    if (successMessage) {
      setLocalSuccessMessage(successMessage);
    }
  }, [successMessage]);

  // Fetch user's playlists when needed
  useEffect(() => {
    if (playlistMode === "existing" && userPlaylists.length === 0) {
      fetchUserPlaylists();
    }
  }, [playlistMode]);

  const fetchUserPlaylists = async () => {
    setIsLoadingPlaylists(true);
    try {
      const response = await fetch(`${API_URL}/api/playlist/user-playlists`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch your playlists");
      }

      setUserPlaylists(data.playlists);
      // Set default selection to first playlist if available
      if (data.playlists.length > 0) {
        setSelectedExistingPlaylist(data.playlists[0].id);
      }
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handleFetchPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSuccessMessage(null);
    if (playlistInput.trim()) {
      fetchPlaylist(playlistInput.trim());
    }
  };

  const handleClearPlaylist = () => {
    // Clear all state related to the current playlist
    setPlaylistInput("");
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setLocalSuccessMessage(null);
    setCreatedPlaylistUrl(null);
    setSearchTerm("");
    clearSelection(); // Clear selected tracks
    // Reset playlist data in the hook
    fetchPlaylist(""); // This will reset the playlistData state
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTracks.size === 0) {
      return; // Don't proceed if no tracks are selected
    }

    setLocalSuccessMessage(null);
    setCreatedPlaylistUrl(null);
    let playlistUrl: string | null = null;

    if (playlistMode === "new") {
      // Create new playlist
      if (newPlaylistName.trim()) {
        playlistUrl = await createPlaylist(
          newPlaylistName.trim(),
          newPlaylistDescription.trim() || undefined
        );
        if (playlistUrl) {
          setCreatedPlaylistUrl(playlistUrl);
        }
      }
    } else {
      // Add to existing playlist
      if (selectedExistingPlaylist) {
        try {
          // Add tracks directly to existing playlist
          const trackIdsArray = Array.from(selectedTracks);
          const response = await fetch(`${API_URL}/api/playlist/add-tracks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlist_id: selectedExistingPlaylist,
              track_ids: trackIdsArray,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            playlistUrl = data.external_url;
            setCreatedPlaylistUrl(playlistUrl);

            // Find the playlist name for the success message
            const selectedPlaylist = userPlaylists.find(
              (p) => p.id === selectedExistingPlaylist
            );
            const playlistName = selectedPlaylist
              ? selectedPlaylist.name
              : "playlist";

            setLocalSuccessMessage(
              `Successfully added ${selectedTracks.size} tracks to "${playlistName}"! 🎉`
            );
          } else {
            throw new Error(data.error || "Failed to add tracks to playlist");
          }
        } catch (err) {
          console.error("Error adding tracks:", err);
        }
      }
    }
  };

  // Format milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Filter tracks based on search term
  const filteredTracks = playlistData?.tracks.filter((track) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search in track name
    if (track.name.toLowerCase().includes(searchLower)) return true;

    // Search in album name
    if (track.album.name.toLowerCase().includes(searchLower)) return true;

    // Search in artists
    if (
      track.artists.some((artist) =>
        artist.name.toLowerCase().includes(searchLower)
      )
    )
      return true;

    return false;
  });

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
  );

  const content = (
    <>
      <p className="text-gray-400 mb-4 text-center">
        Create a new playlist by selecting songs from an existing Spotify
        playlist
      </p>

      {/* Step 1: Input playlist URL/ID */}
      <form onSubmit={handleFetchPlaylist} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Spotify playlist URL or ID"
            value={playlistInput}
            onChange={(e) => setPlaylistInput(e.target.value)}
            className="flex-grow p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !playlistInput.trim()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && !playlistData ? "Loading..." : "Import"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {localSuccessMessage && (
        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">
          {localSuccessMessage}
          {createdPlaylistUrl && (
            <div className="mt-2">
              <a
                href={createdPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline font-medium"
              >
                Open in Spotify
              </a>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Display playlist tracks */}
      {playlistData && (
        <div className="mb-6">
          {/* Playlist information with horizontal layout */}
          <div className="flex items-center mb-3 p-2 bg-white/5 rounded-lg">
            {playlistData.playlist.images[0] && (
              <img
                src={playlistData.playlist.images[0].url}
                alt={playlistData.playlist.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-medium text-white">
                {playlistData.playlist.name}
              </h4>
              <p className="text-sm text-gray-400">
                by {playlistData.playlist.owner} •{" "}
                {playlistData.playlist.tracks_total} tracks
              </p>
            </div>

            {/* Clear button */}
            <button
              onClick={handleClearPlaylist}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-lg transition-colors"
              title="Clear playlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-between items-center mb-2">
            <h4 className="text-white font-medium">
              Select tracks ({selectedTracks.size}/{playlistData.tracks.length})
            </h4>
            <div className="flex gap-2">
              <button
                onClick={selectAllTracks}
                className="text-xs text-green-400 hover:underline"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Search bar for tracks */}
          <div className="mb-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search songs, artists, or albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Track list container */}
          <div className="max-h-96 overflow-y-auto pr-1 mb-4 border border-white/10 rounded-lg">
            {filteredTracks && filteredTracks.length > 0 ? (
              filteredTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => toggleTrackSelection(track.id)}
                  className={`p-3 border-b border-white/10 last:border-b-0 flex items-center gap-4 cursor-pointer transition-colors ${
                    selectedTracks.has(track.id)
                      ? "bg-green-500/10"
                      : "hover:bg-white/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`track-${track.id}`}
                    checked={selectedTracks.has(track.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent double toggling
                      toggleTrackSelection(track.id);
                    }}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <div className="w-14 h-14 flex-shrink-0">
                    <img
                      src={
                        track.album.images[0]?.url ||
                        "https://via.placeholder.com/56"
                      }
                      alt={track.album.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-white font-medium truncate">
                      {track.name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {track.album.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDuration(track.duration_ms)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">
                {searchTerm
                  ? "No tracks matching your search"
                  : "No tracks available"}
              </div>
            )}
          </div>

          {/* Search results info - show if search is active */}
          {searchTerm && filteredTracks && (
            <div className="text-xs text-gray-400 mb-3 text-center">
              Found {filteredTracks.length} of {playlistData.tracks.length}{" "}
              tracks
            </div>
          )}

          {/* Step 3: Choose playlist destination and submit */}
          {selectedTracks.size > 0 && (
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              {/* Toggle between new playlist and existing playlist */}
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPlaylistMode("new")}
                  className={`flex-1 py-2 text-center ${
                    playlistMode === "new"
                      ? "bg-green-500/30 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Create New Playlist
                </button>
                <button
                  type="button"
                  onClick={() => setPlaylistMode("existing")}
                  className={`flex-1 py-2 text-center ${
                    playlistMode === "existing"
                      ? "bg-green-500/30 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Add to Existing Playlist
                </button>
              </div>

              {/* Fields for creating new playlist */}
              {playlistMode === "new" && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="playlistName"
                      className="text-gray-400 text-sm block mb-1"
                    >
                      New Playlist Name
                    </label>
                    <input
                      id="playlistName"
                      type="text"
                      placeholder="My Awesome Playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="playlistDesc"
                      className="text-gray-400 text-sm block mb-1"
                    >
                      Description (optional)
                    </label>
                    <input
                      id="playlistDesc"
                      type="text"
                      placeholder="Songs I selected from..."
                      value={newPlaylistDescription}
                      onChange={(e) =>
                        setNewPlaylistDescription(e.target.value)
                      }
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>
              )}

              {/* Dropdown for selecting existing playlist */}
              {playlistMode === "existing" && (
                <div>
                  <label
                    htmlFor="existingPlaylist"
                    className="text-gray-400 text-sm block mb-1"
                  >
                    Select a Playlist
                  </label>

                  {isLoadingPlaylists ? (
                    <div className="p-2 text-center text-gray-400">
                      Loading your playlists...
                    </div>
                  ) : userPlaylists.length > 0 ? (
                    <div className="relative">
                      <select
                        id="existingPlaylist"
                        value={selectedExistingPlaylist}
                        onChange={(e) =>
                          setSelectedExistingPlaylist(e.target.value)
                        }
                        className="w-full p-2 pr-8 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50 appearance-none"
                        required
                      >
                        {userPlaylists.map((playlist) => (
                          <option key={playlist.id} value={playlist.id}>
                            {playlist.name} ({playlist.tracks_total} tracks)
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-500">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                        </svg>
                      </div>

                      {/* Custom dropdown styles for supported browsers */}
                      <style>{`
                        select option {
                          background-color: #1f1f1f;
                          color: white;
                        }
                      `}</style>
                    </div>
                  ) : (
                    <div className="p-2 text-center text-gray-400 border border-white/10 rounded-lg bg-white/5">
                      No playlists found. Try creating a new playlist instead.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={fetchUserPlaylists}
                    className="text-xs text-green-400 hover:underline mt-1"
                  >
                    Refresh playlist list
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  selectedTracks.size === 0 ||
                  (playlistMode === "new" && !newPlaylistName.trim()) ||
                  (playlistMode === "existing" && !selectedExistingPlaylist)
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Processing..."
                  : playlistMode === "new"
                  ? `Create Playlist with ${selectedTracks.size} Tracks`
                  : `Add ${selectedTracks.size} Tracks to Playlist`}
              </button>
            </form>
          )}
        </div>
      )}

      {!playlistData && !isLoading && !error && !localSuccessMessage && (
        <div className="text-center py-8 text-gray-400">
          <p>Enter a Spotify playlist URL or ID to get started</p>
          <p className="text-xs mt-2">
            Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
          </p>
        </div>
      )}
    </>
  );

  return (
    <Card
      title="Playlist Maker"
      icon={icon}
      className="col-span-1 sm:col-span-2 md:col-span-3"
    >
      {content}
    </Card>
  );
};

export default PlaylistToolCard;
