
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
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Logo icon similar to lemlist style */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Background square with rounded corners */}
            <rect x="2" y="2" width="28" height="28" rx="6" fill="#2563EB" />
            
            {/* Stylized M letter */}
            <path
              d="M9,8 L9,24 L12,24 L12,14 L16,20 L20,14 L20,24 L23,24 L23,8 L20,8 L16,16 L12,8 Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="0.5"
            />
            
            {/* Dot representing the connection point/AI element */}
            <circle cx="16" cy="19" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>
      {withText && (
        <span className="font-bold text-xl tracking-tight">
          mizi<span className="text-blue-600">.ai</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
