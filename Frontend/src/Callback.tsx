import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./components/auth/AuthProvider";

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`http://localhost:8000/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Access token response:", data);
          // Use login function instead of directly setting localStorage
          login(data.access_token);
          navigate("/");
        })
        .catch((err) => {
          console.error("Error exchanging code for token:", err);
        });
    }
  }, [navigate, login]);

  return (
    <div className="flex justify-center items-center h-screen text-white bg-black">
      <h2 className="text-2xl">Authenticating with Spotify...</h2>
    </div>
  );
};

export default Callback;
