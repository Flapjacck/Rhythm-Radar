import { useState, useEffect } from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import Button from "../../components/common/Button";
import UserAvatar from "../../components/common/UserAvatar";

interface UserProfile {
  display_name: string;
  images: Array<{ url: string }>;
  product: string; // "premium" or "free"
}

const NavBar = () => {
  const { token, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user profile when component mounts and token is available
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserProfile(data);
          console.log("User profile:", data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [token]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 py-4 px-6 relative z-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo with SVG and glowing text */}
          <div className="flex items-center space-x-3">
            <div className="animate-pulse-glow">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="fill-green-500"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 animate-pulse-glow">
              Rhythm Radar
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {userProfile && (
              <div className="flex items-center gap-3">
                <UserAvatar
                  imageUrl={userProfile.images?.[0]?.url || null}
                  isPremium={userProfile.product === "premium"}
                  size="md"
                />
                <span className="text-white font-medium">
                  {userProfile.display_name}
                </span>
              </div>
            )}
            <Button text="Logout" onClick={logout} className="py-2 px-5" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Fixed positioning */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-[72px] z-50 bg-neutral-900 border-b border-neutral-800 shadow-lg animate-fadeIn md:hidden">
            <div className="p-4 max-w-5xl mx-auto">
              {userProfile ? (
                <div className="flex items-center gap-3 mb-4 p-2">
                  <UserAvatar
                    imageUrl={userProfile.images?.[0]?.url || null}
                    isPremium={userProfile.product === "premium"}
                    size="md"
                  />
                  <span className="text-white font-medium">
                    {userProfile.display_name}
                  </span>
                </div>
              ) : (
                <div className="h-12 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Loading profile...</span>
                </div>
              )}
              <div className="grid gap-2">
                <Button
                  text="Dashboard"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/";
                  }}
                  className="w-full justify-center py-2 text-base"
                />
                <Button
                  text="Logout"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center py-2 text-base bg-gradient-to-r from-red-500 to-rose-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal overlay for mobile menu - dims the background when menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default NavBar;
