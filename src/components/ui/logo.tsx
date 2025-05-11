
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
      spacing: "gap-1"
    },
    md: {
      fontSize: "1.5rem", // text-2xl
      spacing: "gap-1.5"
    },
    lg: {
      fontSize: "1.875rem", // text-3xl
      spacing: "gap-2"
    },
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className={`flex items-baseline ${sizeClasses[size].spacing}`}>
          <span 
            className="font-bold text-black leading-none" 
            style={{ fontSize: sizeClasses[size].fontSize }}
          >
            ×
          </span>
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
