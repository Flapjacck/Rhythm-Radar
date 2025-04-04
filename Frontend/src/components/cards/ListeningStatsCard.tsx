import Card from "../common/Card";
import { useListeningStats } from "../../hooks/useSpotifyData";

const ListeningStatsCard = () => {
  const { data: stats, loading, error } = useListeningStats();

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  const content = (
    <>
      <p className="text-gray-400">Visualize your music habits over time.</p>

      {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}

      <div className="mt-6">
        {loading ? (
          // Loading skeleton
          <div className="animate-pulse">
            <div className="flex items-end justify-center gap-1 h-10">
              {[40, 25, 60, 30, 45, 75, 50].map((height, i) => (
                <div
                  key={i}
                  className="w-3 bg-green-500/30 rounded-t-sm"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-2 bg-green-500/20 rounded-full w-12"
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top Genres Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-green-400 mb-2">
                Top Genres
              </h4>
              <div className="flex flex-wrap justify-center gap-1">
                {stats?.medium_term_genres?.map((genre, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-500/20 text-white px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Genre visualization - kept for visual effect */}
            <div className="flex items-end justify-center gap-1 h-8 mb-4">
              {stats?.medium_term_genres?.map((_genre, i) => (
                <div
                  key={i}
                  className="w-3 bg-green-500/30 hover:bg-green-500/50 rounded-t-sm"
                  style={{ height: `${Math.random() * 50 + 30}%` }}
                ></div>
              )) ||
                Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="w-3 bg-green-500/30 rounded-t-sm"
                      style={{ height: `${Math.random() * 50 + 30}%` }}
                    ></div>
                  ))}
            </div>

            {/* New Discoveries */}
            {stats?.trend?.new_discoveries &&
              stats.trend.new_discoveries.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-green-400 mb-1">
                    New Discoveries
                  </h4>
                  <div className="text-xs text-white text-center">
                    {stats.trend.new_discoveries
                      .slice(0, 3)
                      .map((artist, i) => (
                        <span key={artist.id || i}>
                          {i > 0 && ", "}
                          {artist.name}
                        </span>
                      ))}
                    {stats.trend.new_discoveries.length > 3 && (
                      <span>
                        {" "}
                        and {stats.trend.new_discoveries.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* Loyal Artists */}
            {stats?.trend?.consistent_favorites &&
              stats.trend.consistent_favorites.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-1">
                    Artists You're Loyal To
                  </h4>
                  <div className="text-xs text-white text-center">
                    {stats.trend.consistent_favorites
                      .slice(0, 3)
                      .map((artist, i) => (
                        <span key={artist.id || i}>
                          {i > 0 && ", "}
                          {artist.name}
                        </span>
                      ))}
                    {stats.trend.consistent_favorites.length > 3 && (
                      <span>
                        {" "}
                        and {stats.trend.consistent_favorites.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </>
  );

  const footer = (
    <div className="text-xs text-gray-500 text-center">
      Based on your last 6 months
    </div>
  );

  return (
    <Card title="Listening Stats" icon={icon} footer={footer}>
      {content}
    </Card>
  );
};

export default ListeningStatsCard;
