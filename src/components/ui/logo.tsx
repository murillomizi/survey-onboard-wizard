
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
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-10 w-auto",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center">
        {/* Logo mark */}
        <div className="relative">
          <span className="text-black font-bold" style={{ fontSize: sizeClasses[size].replace('h-', '') }}>×</span>
          <span className="text-black font-bold ml-0.5" style={{ fontSize: sizeClasses[size].replace('h-', '') }}>mizi</span>
        </div>
      </div>
      {withText && !projectName.toLowerCase().includes("mizi") && (
        <span className="text-sm md:text-base font-semibold tracking-tight ml-1">
          {projectName}
        </span>
      )}
    </Link>
  );
};

export default Logo;
