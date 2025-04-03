// New component: ListeningActivityHeatmapCard.tsx
import { useState, useEffect } from "react";
import Card from "../common/card";

// Mock data structure - this would come from your backend
interface DayActivity {
  date: string; // ISO date string
  count: number; // Number of tracks listened to
}

const ListeningActivityHeatmapCard = () => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DayActivity[]>([]);
  const [hoverInfo, setHoverInfo] = useState<{
    date: string;
    count: number;
  } | null>(null);

  // This would be replaced with an actual API call
  useEffect(() => {
    // Simulate API loading
    setLoading(true);

    // Generate mock data for demonstration
    setTimeout(() => {
      const mockData: DayActivity[] = [];
      const now = new Date();
      const daysToGenerate =
        timeRange === "weekly" ? 7 * 8 : timeRange === "monthly" ? 30 : 365;

      for (let i = 0; i < daysToGenerate; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        mockData.push({
          date: date.toISOString().split("T")[0],
          // Random count between 0 and 15, higher probability for lower numbers
          count: Math.floor(Math.random() * Math.random() * 15),
        });
      }

      setData(mockData.reverse()); // Reverse to get chronological order
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  // Function to determine color intensity based on listening count
  const getBoxColor = (count: number) => {
    if (count === 0) return "bg-white/5";
    if (count < 3) return "bg-green-900/30";
    if (count < 6) return "bg-green-700/40";
    if (count < 10) return "bg-green-500/50";
    return "bg-green-400/60";
  };

  // Format date for display in tooltip
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group data by weeks for display
  const groupDataByWeeks = () => {
    const weeks: DayActivity[][] = [];
    let currentWeek: DayActivity[] = [];

    // Ensure we have 7 days per week for display by padding
    const padToWeekday = (firstDate: Date) => {
      const day = firstDate.getDay();
      if (day > 0) {
        // Not Sunday
        for (let i = 0; i < day; i++) {
          currentWeek.push({ date: "", count: -1 }); // -1 indicates "no data"
        }
      }
    };

    if (data.length > 0) {
      const firstDate = new Date(data[0].date);
      padToWeekday(firstDate);

      data.forEach((day) => {
        // Removed unused variable 'date'
        if (currentWeek.length === 7) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
        currentWeek.push(day);
      });

      // Push the last week if it has any data
      if (currentWeek.length > 0) {
        // Pad the last week if needed
        while (currentWeek.length < 7) {
          currentWeek.push({ date: "", count: -1 });
        }
        weeks.push(currentWeek);
      }
    }

    return weeks;
  };

  const weeks = groupDataByWeeks();

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
    </svg>
  );

  const content = (
    <>
      <p className="text-gray-400 mb-4">
        Visualize your music listening habits over time
      </p>

      <div className="flex justify-center gap-2 text-xs mb-6">
        <button
          onClick={() => setTimeRange("weekly")}
          className={`px-3 py-1 rounded ${
            timeRange === "weekly"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          8 Weeks
        </button>
        <button
          onClick={() => setTimeRange("monthly")}
          className={`px-3 py-1 rounded ${
            timeRange === "monthly"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setTimeRange("yearly")}
          className={`px-3 py-1 rounded ${
            timeRange === "yearly"
              ? "bg-green-500/30 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Year
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-44 w-full bg-white/5 rounded-md"></div>
          <div className="h-2 bg-green-500/20 rounded-full my-3 w-3/4 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Days of week labels */}
          <div className="flex mb-2">
            <div className="w-8 text-right pr-2"></div>
            <div className="flex-grow grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <div
                    key={day}
                    className="h-4 text-xs text-center text-gray-500"
                  >
                    {i % 2 === 0 ? day : ""}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="relative">
            {/* Tooltip for hovering */}
            {hoverInfo && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded shadow-lg z-10">
                {formatDate(hoverInfo.date)}: {hoverInfo.count} tracks
              </div>
            )}

            <div className="flex">
              {/* Month labels on the side */}
              <div className="w-8 text-right pr-2">
                {weeks.map((_, index) => {
                  // Show month label at first week of month or at multiples of 4
                  if (index % 4 === 0 && index < weeks.length) {
                    const monthDate = new Date(
                      weeks[index][0]?.date || new Date()
                    );
                    return (
                      <div
                        key={index}
                        className="h-[18px] text-xs text-gray-500 mt-1"
                      >
                        {monthDate.toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                    );
                  }
                  return <div key={index} className="h-[18px]"></div>;
                })}
              </div>

              {/* Heatmap cells */}
              <div className="flex-grow">
                <div className="grid grid-rows-[repeat(auto-fill,minmax(18px,1fr))] gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-[18px] h-[18px] rounded-sm ${
                            day.count === -1
                              ? "bg-transparent"
                              : getBoxColor(day.count)
                          } cursor-pointer transition-colors hover:ring-1 hover:ring-white/30`}
                          onMouseEnter={() =>
                            day.count !== -1 && setHoverInfo(day)
                          }
                          onMouseLeave={() => setHoverInfo(null)}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end mt-4 gap-1 text-xs text-gray-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-white/5"></div>
            <div className="w-3 h-3 rounded-sm bg-green-900/30"></div>
            <div className="w-3 h-3 rounded-sm bg-green-700/40"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500/50"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400/60"></div>
            <span>More</span>
          </div>

          {/* Top activity stats */}
          <div className="mt-6 bg-white/5 p-3 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">
              Listening Insights
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white">Most Active Day</div>
                <div className="text-gray-400">
                  {formatDate(
                    data.reduce(
                      (max, day) => (max.count > day.count ? max : day),
                      { date: "", count: -1 }
                    ).date
                  )}
                </div>
              </div>
              <div>
                <div className="text-white">Weekly Average</div>
                <div className="text-gray-400">
                  {Math.round(
                    data.reduce((sum, day) => sum + day.count, 0) /
                      (data.length / 7)
                  )}{" "}
                  tracks
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const footer = (
    <div className="text-center text-xs text-gray-500">
      Based on your listening history from Spotify
    </div>
  );

  return (
    <Card
      title="Listening Activity"
      icon={icon}
      footer={footer}
      className="col-span-1 sm:col-span-2 md:col-span-3"
    >
      {content}
    </Card>
  );
};

export default ListeningActivityHeatmapCard;
