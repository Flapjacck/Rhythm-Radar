interface UserAvatarProps {
  imageUrl: string | null;
  isPremium: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar = ({
  imageUrl,
  isPremium,
  size = "md",
  className = "",
}: UserAvatarProps) => {
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  // Premium badge classes
  const badgeClasses = {
    sm: "w-3 h-3 -top-0.5 -right-0.5 text-[6px]",
    md: "w-4 h-4 -top-1 -right-1 text-[8px]",
    lg: "w-5 h-5 -top-1 -right-1 text-[10px]",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-green-500`}
      >
        <img
          src={imageUrl || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      {isPremium && (
        <div
          className={`absolute ${badgeClasses[size]} bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center`}
        >
          <span className="text-white font-bold">P</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
