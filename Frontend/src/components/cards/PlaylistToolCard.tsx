import { useState } from "react";
import Card from "../common/card";
import { usePlaylistTool } from "../../hooks/useSpotifyData";

const PlaylistToolCard = () => {
  const [playlistInput, setPlaylistInput] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [createdPlaylistUrl, setCreatedPlaylistUrl] = useState<string | null>(
    null
  );
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

  const handleFetchPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistInput.trim()) {
      fetchPlaylist(playlistInput.trim());
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const url = await createPlaylist(
        newPlaylistName.trim(),
        newPlaylistDescription.trim() || undefined
      );
      if (url) {
        setCreatedPlaylistUrl(url);
      }
    }
  };

  // Format milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

      {successMessage && (
        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">
          {successMessage}
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
          {/* More compact playlist information with horizontal layout */}
          <div className="flex items-center mb-3 p-2 bg-white/5 rounded-lg ">
            {playlistData.playlist.images[0] && (
              <img
                src={playlistData.playlist.images[0].url}
                alt={playlistData.playlist.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
              />
            )}
            <div className="flex-1 -ml-10">
              <h4 className="text-lg font-medium text-white">
                {playlistData.playlist.name}
              </h4>
              <p className="text-sm text-gray-400">
                by {playlistData.playlist.owner} •{" "}
                {playlistData.playlist.tracks_total} tracks
              </p>
            </div>
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

          {/* Larger track list container */}
          <div className="max-h-96 overflow-y-auto pr-1 mb-4 border border-white/10 rounded-lg">
            {playlistData.tracks.map((track) => (
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
                <div className="flex-grow overflow-hidden ">
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
            ))}
          </div>

          {/* Step 3: Create new playlist form */}
          {selectedTracks.size > 0 && (
            <form onSubmit={handleCreatePlaylist} className="space-y-3">
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
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !newPlaylistName.trim() ||
                  selectedTracks.size === 0
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Creating..."
                  : `Create Playlist with ${selectedTracks.size} Tracks`}
              </button>
            </form>
          )}
        </div>
      )}

      {!playlistData && !isLoading && !error && !successMessage && (
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
