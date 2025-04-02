import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`http://localhost:8000/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Access token response:", data);
          localStorage.setItem("access_token", data.access_token);
          navigate("/");
        })
        .catch((err) => {
          console.error("Error exchanging code for token:", err);
        });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-white bg-black">
      <h2 className="text-2xl">Authenticating with Spotify...</h2>
    </div>
  );
};

export default Callback;
