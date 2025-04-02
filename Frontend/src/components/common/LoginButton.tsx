import { useState } from "react";

interface LoginButtonProps {
  text?: string;
  className?: string;
}

const LoginButton = ({
  text = "Connect with Spotify",
  className = "",
}: LoginButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    // Redirect to backend login endpoint
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <button
      onClick={handleLogin}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-gradient-to-r from-green-500 to-emerald-600 
        py-3 px-8 rounded-full text-white font-semibold text-lg
        transition-all duration-300 transform ${
          isHovered ? "scale-105 shadow-lg" : ""
        } 
        hover:shadow-green-500/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500
        ${className}
      `}
    >
      <div className="flex items-center">
        {/* Spotify logo */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="mr-2 fill-white"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        {text}
      </div>

      {/* Animated rings */}
      <span
        className={`
        absolute inset-0 border-2 border-green-400 rounded-full
        ${isHovered ? "animate-ping opacity-0" : "opacity-0"}
      `}
      ></span>
    </button>
  );
};

export default LoginButton;
