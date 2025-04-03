import NavBar from "../components/ui/NavBar";
import Card from "../components/common/card";

const Dashboard = () => {
  // Example card data with different content types
  const cardData = [
    {
      title: "Top Artists",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-400">
            Discover who you've been listening to the most.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-green-500/20"
              ></div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Top Tracks",
      icon: (
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
      ),
      content: (
        <>
          <p className="text-gray-400">Your most-played tracks of all time.</p>
          <div className="mt-4 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-2 bg-green-500/20 rounded-full"></div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Listening Stats",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-400">
            Visualize your music habits over time.
          </p>
          <div className="mt-4 flex items-end justify-center gap-1 h-10">
            {[40, 25, 60, 30, 45, 75, 50].map((height, i) => (
              <div
                key={i}
                className="w-3 bg-green-500/30 rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </>
      ),
      footer: (
        <p className="text-xs text-gray-500 text-center">
          Based on your last 6 months
        </p>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-neutral-900 text-white font-outfit overflow-hidden starry-background">
      {/* Navbar */}
      <NavBar />
      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Rhythm Radar 🎧
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            You've successfully connected with Spotify.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {cardData.map((card, idx) => (
              <Card
                key={idx}
                title={card.title}
                icon={card.icon}
                onClick={() => console.log(`Clicked on ${card.title}`)}
                footer={card.footer}
              >
                {card.content}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
