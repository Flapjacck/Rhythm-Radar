import { ReactNode, useState } from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

const Button = ({ text, onClick, icon, className = "" }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
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
      <div className="flex items-center justify-center gap-2">
        {icon}
        {text}
      </div>

      <span
        className={`
          absolute inset-0 border-2 border-green-400 rounded-full
          ${isHovered ? "animate-ping opacity-0" : "opacity-0"}
        `}
      ></span>
    </button>
  );
};

export default Button;
