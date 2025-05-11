
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface LogoProps {
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  projectName?: string;
  showProjectArrow?: boolean;
}

const Logo = ({
  withText = true,
  size = "md",
  className = "",
  projectName = "mizi",
  showProjectArrow = false
}: LogoProps) => {
  const sizeClasses = {
    sm: {
      fontSize: "1.25rem",
      logoSize: 20,
      spacing: "gap-0.5"
    },
    md: {
      fontSize: "1.5rem",
      logoSize: 24,
      spacing: "gap-1"
    },
    lg: {
      fontSize: "1.875rem",
      logoSize: 32,
      spacing: "gap-1.5"
    }
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className={`flex items-center ${sizeClasses[size].spacing}`}>
          <svg width={sizeClasses[size].logoSize} height={sizeClasses[size].logoSize} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
            <defs>
              <linearGradient id="miziGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#C8C8C9" />
                <stop offset="100%" stopColor="#8E9196" />
              </linearGradient>
            </defs>
            <path d="M165.712 34.288C172.945 41.522 173.511 52.568 167.088 60.555L114.823 124.784L167.088 189.014C173.511 197.001 172.945 208.047 165.712 215.28C158.478 222.514 147.432 223.08 139.445 216.657L80.664 169.527L21.884 216.657C13.897 223.08 2.851 222.514 -4.383 215.28C-11.616 208.047 -12.183 197.001 -5.759 189.014L46.504 124.784L-5.759 60.555C-12.183 52.568 -11.616 41.522 -4.383 34.288C2.851 27.055 13.897 26.489 21.884 32.912L80.664 80.042L139.445 32.912C147.432 26.489 158.478 27.055 165.712 34.288Z" fill="url(#miziGradient)" transform="scale(0.8) translate(20, 10)" />
          </svg>
        </div>
      </div>
      {withText && (
        <div className="ml-2 flex items-center">
          <span className="font-semibold tracking-tight" style={{
            fontSize: "calc(" + sizeClasses[size].fontSize + " * 0.55)"
          }}>
            {projectName}
          </span>
          {showProjectArrow && (
            <ChevronDown size={12} className="ml-1 text-minimal-gray-400" />
          )}
        </div>
      )}
    </Link>
  );
};

export default Logo;
