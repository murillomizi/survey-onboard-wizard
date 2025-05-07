
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
        {/* Logo minimalista */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Forma simples em preto e branco */}
            <circle cx="16" cy="16" r="14" fill="white" stroke="black" strokeWidth="2" />
            <path
              d="M10,10 L12,10 L14,16 L16,10 L18,10 L20,16 L22,10 L24,10 L20,22 L18,22 L16,16 L14,22 L12,22 L10,10 Z"
              fill="black"
            />
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
