import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./components/auth/AuthProvider";

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      setError(`Spotify authorization error: ${errorParam}`);
      return;
    }

    // Direct token handling
    if (token) {
      login(token);
      navigate("/");
      return;
    }

    // Fallback to code exchange if no direct token
    const code = urlParams.get("code");
    if (!code) {
      setError("No authorization code or token received");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/callback?code=${code}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to exchange code for token");
          });
        }
        return res.json();
      })
      .then((data) => {
        login(data.access_token);
        navigate("/");
      })
      .catch((err) => {
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
