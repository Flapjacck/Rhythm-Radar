import { useState } from "react";
import Card from "../common/card";
import { useTopTracks } from "../../hooks/useSpotifyData";

interface TopTracksCardProps {
  onTrackClick?: (trackId: string, previewUrl: string | null) => void;
}

const TopTracksCard = ({ onTrackClick }: TopTracksCardProps) => {
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const { data: tracks, loading, error } = useTopTracks(timeRange, 5);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handleTimeRangeChange = (
    newRange: "short_term" | "medium_term" | "long_term"
  ) => {
    setTimeRange(newRange);
  };

  const handlePlayTrack = (trackId: string, previewUrl: string | null) => {
    if (previewUrl) {
      if (playingTrackId === trackId) {
        setPlayingTrackId(null);
      } else {
        setPlayingTrackId(trackId);
        onTrackClick?.(trackId, previewUrl);
      }
    }
  };

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const content = (
    <>
      <p className="text-gray-400">Your most-played tracks of all time.</p>

      <div className="flex justify-center gap-2 text-xs mt-2 mb-3">
        <button
          onClick={() => handleTimeRangeChange("short_term")}
          className={`px-2 py-1 rounded ${
            timeRange === "short_term"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          4 weeks
        </button>
        <button
          onClick={() => handleTimeRangeChange("medium_term")}
          className={`px-2 py-1 rounded ${
            timeRange === "medium_term"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          6 months
        </button>
        <button
          onClick={() => handleTimeRangeChange("long_term")}
          className={`px-2 py-1 rounded ${
            timeRange === "long_term"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          All time
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}

      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-white/5 rounded-md animate-pulse flex p-2"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-sm"></div>
                <div className="ml-2 flex-1">
                  <div className="h-2 bg-green-500/20 rounded-full w-2/3"></div>
                  <div className="h-2 bg-green-500/10 rounded-full w-1/2 mt-2"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Track list
          <div>
            {tracks?.map((track) => (
              <div
                key={track.id}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 mb-2"
                onClick={() => handlePlayTrack(track.id, track.preview_url)}
              >
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src={
                      track.album.images[0]?.url ||
                      "https://via.placeholder.com/40"
                    }
                    alt={track.album.name}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm text-white truncate">{track.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artists[0].name}
                  </p>
                </div>
                {track.preview_url && (
                  <button className="text-green-400 ml-auto">
                    {playingTrackId === track.id ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const footer = (
    <div className="text-center">
      <button className="text-xs text-green-400 hover:underline">
        See full track history
      </button>
    </div>
  );

  return (
    <Card title="Top Tracks" icon={icon} footer={footer}>
      {content}
    </Card>
  );
};

export default TopTracksCard;
