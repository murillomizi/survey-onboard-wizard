
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  projectName?: string;
}

const Logo = ({ withText = true, size = "md", className = "", projectName = "mizi" }: LogoProps) => {
  const sizeClasses = {
    sm: {
      fontSize: "1.25rem", // text-xl
      logoSize: 20,
      spacing: "gap-2"
    },
    md: {
      fontSize: "1.5rem", // text-2xl
      logoSize: 24,
      spacing: "gap-2.5"
    },
    lg: {
      fontSize: "1.875rem", // text-3xl
      logoSize: 32,
      spacing: "gap-3"
    },
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className={`flex items-center ${sizeClasses[size].spacing}`}>
          <svg 
            width={sizeClasses[size].logoSize}
            height={sizeClasses[size].logoSize}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
            strokeWidth="2"
          >
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            className="font-bold text-black leading-none" 
            style={{ fontSize: sizeClasses[size].fontSize }}
          >
            mizi
          </span>
        </div>
      </div>
      {withText && !projectName.toLowerCase().includes("mizi") && (
        <span className="ml-3 font-semibold tracking-tight" style={{ fontSize: "calc(" + sizeClasses[size].fontSize + " * 0.85)" }}>
          {projectName}
        </span>
      )}
    </Link>
  );
};

export default Logo;
