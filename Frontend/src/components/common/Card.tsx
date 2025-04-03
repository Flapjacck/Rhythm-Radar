import { ReactNode, useState } from "react";

export interface CardProps {
  /** Optional title for the card */
  title?: string;
  /** Optional title color, defaults to green-400 */
  titleColor?: string;
  /** Children components/content to render inside the card */
  children: ReactNode;
  /** Optional onClick handler for the entire card */
  onClick?: () => void;
  /** Optional additional class names */
  className?: string;
  /** Whether to add hover effects */
  interactive?: boolean;
  /** Optional icon to display next to title */
  icon?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
}

const Card = ({
  title,
  titleColor = "text-green-400",
  children,
  onClick,
  className = "",
  interactive = true,
  icon,
  footer,
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => interactive && setIsHovered(true);
  const handleMouseLeave = () => interactive && setIsHovered(false);

  return (
    <div
      className={`
        relative bg-white/5 border rounded-2xl p-6 
        backdrop-blur-sm
        ${interactive ? "cursor-pointer" : ""}
        ${
          interactive && isHovered
            ? "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.25)]"
            : "border-white/10 shadow-xl"
        }
        transition-colors duration-300 ease-in-out
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card content wrapper - no scaling */}
      <div>
        {title && (
          <div className="flex items-center gap-2 mb-4">
            {icon && <span className="text-green-400">{icon}</span>}
            <h3 className={`text-xl font-bold ${titleColor}`}>{title}</h3>
          </div>
        )}

        <div className="card-content">{children}</div>

        {footer && (
          <div className="mt-4 pt-4 border-t border-white/10">{footer}</div>
        )}
      </div>

      {/* Subtle background glow effect instead of scaling */}
      {isHovered && interactive && (
        <div className="absolute inset-0 -z-10 bg-green-500/5 rounded-2xl" />
      )}
    </div>
  );
};

export default Card;
