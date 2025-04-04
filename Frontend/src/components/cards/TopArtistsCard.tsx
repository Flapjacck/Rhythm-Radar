import { useState } from "react";
import Card from "../common/Card";
import { useTopArtists } from "../../hooks/useSpotifyData";

interface TopArtistsCardProps {
  onArtistClick?: (artistId: string) => void;
}

const TopArtistsCard = ({ onArtistClick }: TopArtistsCardProps) => {
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const { data: artists, loading, error } = useTopArtists(timeRange, 10);

  const handleTimeRangeChange = (
    newRange: "short_term" | "medium_term" | "long_term"
  ) => {
    setTimeRange(newRange);
  };

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const content = (
    <>
      <p className="text-gray-400">
        Discover who you've been listening to the most.
      </p>

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

      <div className="mt-4">
        {loading ? (
          // Loading skeleton
          <div className="animate-pulse">
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-green-500/20"
                />
              ))}
            </div>
            <div className="h-2 bg-green-500/20 rounded-full my-2 w-3/4 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Artist circles with images */}
            <div className="flex justify-center gap-3 flex-wrap">
              {artists?.slice(0, 5).map((artist) => (
                <div
                  key={artist.id}
                  className="relative group cursor-pointer"
                  onClick={() => onArtistClick?.(artist.id)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 hover:border-green-500/50 transition-all">
                    <img
                      src={
                        artist.images[0]?.url ||
                        "https://via.placeholder.com/40"
                      }
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    {artist.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Artist names */}
            {artists && artists.length > 0 && (
              <div className="mt-5">
                <p className="text-xs text-center text-white">
                  {artists
                    .slice(0, 3)
                    .map((a) => a.name)
                    .join(", ")}
                  {artists.length > 3 ? ", and more" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  const footer = (
    <div className="text-center">
      <button className="text-xs text-green-400 hover:underline">
        View detailed analysis
      </button>
    </div>
  );

  return (
    <Card title="Top Artists" icon={icon} footer={footer}>
      {content}
    </Card>
  );
};

export default TopArtistsCard;
