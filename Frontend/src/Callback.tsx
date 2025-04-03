import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./components/auth/AuthProvider";

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      setError(`Spotify authorization error: ${errorParam}`);
      return;
    }

    if (!code) {
      setError("No authorization code received from Spotify");
      return;
    }

    fetch(`http://localhost:8000/callback?code=${code}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to exchange code for token");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Access token response:", data);
        login(data.access_token);
        navigate("/");
      })
      .catch((err) => {
        console.error("Error exchanging code for token:", err);
        setError(err.message || "Failed to exchange code for token");
      });
  }, [navigate, login]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-black">
        <h2 className="text-2xl text-red-400">Authentication Error</h2>
        <p className="mt-2">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
          onClick={() => (window.location.href = "/")}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen text-white bg-black">
      <h2 className="text-2xl">Authenticating with Spotify...</h2>
    </div>
  );
};

export default Callback;
