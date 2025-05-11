
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
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/efdfbdf5-05a6-4a15-aac7-d651561e8496.png" 
        alt="Mizi Logo" 
        className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105`} 
      />
      {withText && (
        <span className="text-sm font-medium tracking-tight">
          {projectName}
        </span>
      )}
    </Link>
  );
};

export default Logo;
