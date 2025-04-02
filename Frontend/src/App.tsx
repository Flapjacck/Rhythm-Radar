import { useEffect, useState } from "react";

type SpotifyUser = {
  display_name: string;
  images: { url: string }[];
};

function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User info:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("Failed to load user info:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">🎵 Your Spotify Dashboard</h1>

      {!user ? (
        <button
          onClick={() => (window.location.href = "http://localhost:8000/login")}
          className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-full font-semibold"
        >
          Connect with Spotify
        </button>
      ) : (
        <div className="bg-white text-black p-6 rounded-xl text-center shadow-xl">
          <h2 className="text-xl font-bold">Welcome, {user.display_name}</h2>
          {user.images?.length > 0 && (
            <img
              src={user.images[0].url}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mt-4"
            />
          )}
          <p className="mt-4">You're connected to Spotify ✅</p>
        </div>
      )}
    </div>
  );
}

export default App;
