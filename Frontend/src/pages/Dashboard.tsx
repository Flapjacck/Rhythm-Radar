import { useAuth } from "../components/auth/AuthProvider";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">Rhythm Radar</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </header>

      <div className="text-white text-center">
        <h2 className="text-2xl mb-4">Welcome to your Dashboard</h2>
        <p>You've successfully authenticated with Spotify!</p>
      </div>
    </div>
  );
};

export default Dashboard;
