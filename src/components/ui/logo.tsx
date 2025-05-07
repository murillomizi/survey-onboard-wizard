
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
        {/* Logo minimalista com temática de AI */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Círculo base com degradê */}
            <defs>
              <linearGradient id="miziGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#miziGradient)" />
            
            {/* Elementos AI minimalistas */}
            <path
              d="M12,11 L12,21 M16,11 L16,21 M20,11 L20,21"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9,15 L23,15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="15" r="1.5" fill="white" />
            <circle cx="20" cy="15" r="1.5" fill="white" />
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
