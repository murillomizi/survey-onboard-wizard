
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
        {/* Elegant icon with gradient and subtle animation */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`}
            aria-label="Mizi Logo"
          >
            {/* Base shape */}
            <defs>
              <linearGradient id="miziGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Hexagon shape */}
            <path
              d="M16,2 L28,9 L28,23 L16,30 L4,23 L4,9 L16,2 Z"
              fill="url(#miziGradient)"
              filter="url(#glow)"
              className="animate-pulse-soft"
            />
            {/* M letter inside */}
            <path
              d="M10,10 L12,10 L14,16 L16,10 L18,10 L20,16 L22,10 L24,10 L20,22 L18,22 L16,16 L14,22 L12,22 L10,10 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      {withText && (
        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Mizi.app
        </span>
      )}
    </Link>
  );
};

export default Logo;
