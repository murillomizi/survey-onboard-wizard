
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
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-12 w-auto",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center">
        <img 
          src="/lovable-uploads/efdfbdf5-05a6-4a15-aac7-d651561e8496.png" 
          alt="Mizi Logo" 
          className={`${sizeClasses[size]} transition-all duration-300 hover:scale-105`} 
        />
      </div>
      {withText && (
        <span className="text-sm md:text-base font-semibold tracking-tight">
          {projectName}
        </span>
      )}
    </Link>
  );
};

export default Logo;
