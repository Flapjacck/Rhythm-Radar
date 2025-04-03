import NavBar from "../components/ui/NavBar";

const Dashboard = () => {
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
            {["Top Artists", "Top Tracks", "Listening Stats"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold mb-2 text-green-400">
                    {title}
                  </h3>
                  <p className="text-gray-400">Coming soon...</p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
