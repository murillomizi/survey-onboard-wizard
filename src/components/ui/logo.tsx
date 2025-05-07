
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
        {/* Logo minimalista em preto e branco */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Círculo base preto */}
            <circle cx="16" cy="16" r="15" fill="#000000" />
            
            {/* Elementos AI minimalistas em branco */}
            <path
              d="M12,10 L12,22 M16,10 L16,22 M20,10 L20,22"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8,16 L24,16"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="2" fill="white" />
            <circle cx="20" cy="16" r="2" fill="white" />
          </svg>
        </div>
      </div>
      {withText && (
        <span className="font-bold text-xl">
          Mizi.app
        </span>
      )}
    </Link>
  );
};

export default Logo;
