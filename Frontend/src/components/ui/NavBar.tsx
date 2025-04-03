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

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 py-4 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-green-500">
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
              className="text-white focus:outline-none"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-800">
            {userProfile && (
              <div className="flex items-center gap-3 mb-4">
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
            <Button
              text="Logout"
              onClick={logout}
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
