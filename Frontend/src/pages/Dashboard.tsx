import { useState, useRef } from "react";
import NavBar from "../components/ui/NavBar";
import TopArtistsCard from "../components/cards/TopArtistsCard";
import TopTracksCard from "../components/cards/TopTracksCard";
import ListeningStatsCard from "../components/cards/ListeningStatsCard";
import NowPlayingCard from "../components/cards/NowPlayingCard";

const Dashboard = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTrackPlay = (trackId: string, previewUrl: string | null) => {
    if (!previewUrl) return;

    if (currentlyPlaying === trackId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentlyPlaying(null);
    } else {
      // Start playing new track
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = previewUrl;
        audioRef.current.play();
      } else {
        audioRef.current = new Audio(previewUrl);
        audioRef.current.play();
      }
      setCurrentlyPlaying(trackId);

      // Reset when track finishes
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  const handleArtistClick = (artistId: string) => {
    window.open(`https://open.spotify.com/artist/${artistId}`, "_blank");
  };

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
            Your personalized music insights dashboard
          </p>

          <div className="mt-10">
            <NowPlayingCard />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            <TopArtistsCard onArtistClick={handleArtistClick} />
            <TopTracksCard onTrackClick={handleTrackPlay} />
            <ListeningStatsCard />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
