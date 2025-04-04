import Button from "../components/common/Button";

const LoginPage = () => {
  return (
    <div className="relative flex flex-col h-screen starry-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="dynamic-background"></div>
        <div className="hidden sm:block absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2Zy...')] opacity-10"></div>
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-green-500/5 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-green-500/5 blur-[100px]"></div>
        <div className="absolute top-[30%] left-[60%] w-[25%] h-[25%] rounded-full bg-green-500/5 blur-[100px]"></div>
        <div className="hidden sm:block absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDkwOTA5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMxYTFhMWEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Sound wave animation - updated to stretch across the entire width */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between space-x-0.5 opacity-20">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="bg-green-500 flex-1 max-w-[8px] min-w-[3px] rounded-t-full animate-sound-wave"
            style={{
              height: `${Math.sin(i / 5) * 50 + 30}%`,
              animationDelay: `${i * 0.02}s`,
              animationDuration: `${1.5 + Math.random() * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Logo and Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 stagger-children">
        <div className="animate-float mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            className="animate-pulse-glow fill-green-500"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
        </div>

        <h1 className="text-5xl font-outfit font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          Rhythm Radar
        </h1>

        <p className="text-gray-400 text-xl mb-10 text-center max-w-md font-outfit font-light">
          Discover your music personality and explore new tracks based on your
          listening habits
        </p>

        <Button
          text="Connect with Spotify"
          onClick={() => {
            const API_URL =
              import.meta.env.VITE_API_URL || "http://localhost:8000";
            window.location.href = `${API_URL}/login`;
          }}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-white"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          }
        />

        <p className="text-gray-500 mt-6 text-center max-w-xs text-sm font-outfit">
          Powered by Spotify API. Login to analyze your music taste and get
          personalized recommendations.
        </p>

        <p className="text-amber-400 mt-6 text-center max-w-xs text-sm font-outfit">
          ⚠️ This app is currently in development mode and only accepts
          authorized Spotify accounts. Contact the developer to request access.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
