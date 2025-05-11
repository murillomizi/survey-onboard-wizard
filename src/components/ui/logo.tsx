
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
          >
            <path 
              d="M6.5 4C5.11929 4 4 5.11929 4 6.5C4 7.88071 5.11929 9 6.5 9C7.11687 9 7.67131 8.76678 8.06044 8.37663L15.6234 15.9396C15.2332 16.3287 15 16.8831 15 17.5C15 18.8807 16.1193 20 17.5 20C18.8807 20 20 18.8807 20 17.5C20 16.1193 18.8807 15 17.5 15C16.8831 15 16.3287 15.2332 15.9395 15.6234L8.37654 8.06042C8.76676 7.67129 9 7.11685 9 6.5C9 5.11929 7.88071 4 6.5 4Z" 
              fill="currentColor"
            />
            <path 
              d="M17.5 4C16.1193 4 15 5.11929 15 6.5C15 7.11687 15.2332 7.67131 15.6234 8.06044L8.06044 15.6234C7.67131 15.2332 7.11687 15 6.5 15C5.11929 15 4 16.1193 4 17.5C4 18.8807 5.11929 20 6.5 20C7.88071 20 9 18.8807 9 17.5C9 16.8831 8.76678 16.3287 8.37663 15.9395L15.9396 8.37654C16.3287 8.76676 16.8831 9 17.5 9C18.8807 9 20 7.88071 20 6.5C20 5.11929 18.8807 4 17.5 4Z" 
              fill="currentColor"
            />
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
