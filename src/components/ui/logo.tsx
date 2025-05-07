
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ withText = true, size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Logo minimalista combinando MZ e AI */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Background circle */}
            <circle cx="16" cy="16" r="15" fill="#000000" />
            
            {/* Abstract M design */}
            <path
              d="M8,10 L8,22 L10,22 L10,14 L13,19 L16,14 L16,22 L18,22 L18,10 L16,10 L13,16 L10,10 Z"
              fill="#ffffff"
            />
            
            {/* Connect M and Z with AI element */}
            <circle cx="19" cy="16" r="1.5" fill="none" stroke="#ffffff" strokeWidth="1" />
            
            {/* Abstract Z design */}
            <path
              d="M20,10 L26,10 L26,12 L22,20 L26,20 L26,22 L20,22 L20,20 L24,12 L20,12 Z"
              fill="#ffffff"
            />
            
            {/* Small connecting dots representing AI/data/intelligence */}
            <circle cx="13" cy="16" r="0.8" fill="#ffffff" />
            <circle cx="19" cy="14" r="0.7" fill="#ffffff" />
            <circle cx="19" cy="18" r="0.7" fill="#ffffff" />
          </svg>
        </div>
      </div>
      {withText && (
        <span className="font-bold text-xl">
          Mizi
        </span>
      )}
    </Link>
  );
};

export default Logo;
