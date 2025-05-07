
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
        {/* Logo minimalista incorporando M, Z, e AI */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Círculo base preto */}
            <circle cx="16" cy="16" r="15" fill="#000000" />
            
            {/* Letra M */}
            <path
              d="M7,10 L7,22 L9,22 L9,14 L11,18 L13,14 L13,22 L15,22 L15,10 L13,10 L11,15 L9,10 Z"
              fill="white"
            />
            
            {/* Letra Z */}
            <path
              d="M17,10 L25,10 L25,12 L19,20 L25,20 L25,22 L17,22 L17,20 L23,12 L17,12 Z"
              fill="white"
            />
            
            {/* Elemento AI - ponto conectivo */}
            <circle cx="16" cy="16" r="1.5" fill="#000000" stroke="white" strokeWidth="0.5" />
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
