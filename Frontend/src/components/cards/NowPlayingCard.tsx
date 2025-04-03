import { useState, useEffect, useRef } from "react";
import Card from "../common/card";
import { useNowPlaying } from "../../hooks/useSpotifyData";

const NowPlayingCard = () => {
  const { data, loading, error } = useNowPlaying(7500); // Poll API every 5 seconds
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [localProgress, setLocalProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);

  // Format time from milliseconds to MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle audio preview play/pause
  const playPreview = (previewUrl: string | null) => {
    if (!previewUrl) return;

    if (audioPlaying) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      audio.src = previewUrl;
      audio.play();
      setAudioPlaying(true);

      audio.onended = () => {
        setAudioPlaying(false);
      };
    }
  };

  // Set up smooth progress tracking
  useEffect(() => {
    // Clear any existing interval when component unmounts or data changes
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Only set up the interval if there's a track actively playing
    if (data?.is_playing && data.track) {
      // Initialize with current progress
      setLocalProgress(data.track.progress_ms);
      lastUpdateTimeRef.current = Date.now();

      // Update progress every 100ms for smooth animation
      progressIntervalRef.current = window.setInterval(() => {
        if (lastUpdateTimeRef.current !== null) {
          const elapsed = Date.now() - lastUpdateTimeRef.current;
          setLocalProgress((prev) =>
            Math.min(prev + elapsed, data.track?.duration_ms || 0)
          );
          lastUpdateTimeRef.current = Date.now();
        }
      }, 100);
    }

    // Clean up on unmount
    return () => {
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [data]);

  // The progress value to display - use API data directly after fetch, otherwise use local progress
  const displayProgress = data?.is_playing && data.track ? localProgress : 0;

  const progressPercentage = data?.track
    ? (displayProgress / data.track.duration_ms) * 100
    : 0;

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
    </svg>
  );

  const content = (
    <>
      {error ? (
        <div className="flex flex-col items-center justify-center h-16 text-gray-400">
          <p>Can't access playback information</p>
          <a
            href="http://localhost:8000/login"
            className="text-xs text-green-400 hover:underline mt-2"
          >
            Grant additional permissions
          </a>
        </div>
      ) : (
        <div className="mt-2">
          {loading ? (
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-green-500/20"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-green-500/20 rounded w-3/4"></div>
                <div className="h-3 bg-green-500/10 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <>
              {data?.is_playing && data.track ? (
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img
                        src={
                          data.track.album.images[0]?.url ||
                          "https://via.placeholder.com/64"
                        }
                        alt={data.track.album.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-center -ml-21">
                      <h4 className="text-white font-semibold text-lg truncate">
                        {data.track.name}
                      </h4>
                      <p className="text-gray-400 text-sm truncate">
                        {data.track.artists.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {data.track.album.name}
                      </p>
                    </div>

                    {data.track.preview_url && (
                      <button
                        onClick={() =>
                          playPreview(data.track?.preview_url || null)
                        }
                        className="text-green-400 hover:text-green-300"
                      >
                        {audioPlaying ? (
                          <svg
                            className="w-8 h-8"
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
                            className="w-8 h-8"
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

                  {/* Progress bar with smooth updates */}
                  <div className="mt-4">
                    <div className="bg-white/10 h-1.5 rounded-full w-full">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-100"
                        style={{
                          width: `${progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formatTime(displayProgress)}</span>
                      <span>{formatTime(data.track.duration_ms)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 text-gray-400">
                  <p>Not currently playing anything</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );

  const footer =
    data?.is_playing && data.track ? (
      <div className="text-center">
        <a
          href={data.track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-green-400 hover:underline"
        >
          Open in Spotify
        </a>
      </div>
    ) : null;

  return (
    <Card
      title="Now Playing"
      icon={icon}
      footer={footer}
      className="col-span-1 sm:col-span-2 md:col-span-3"
    >
      {content}
    </Card>
  );
};

export default NowPlayingCard;
