
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import LogoIcon from "./LogoIcon";
import LogoDropdownContent from "./LogoDropdownContent";

interface LogoProps {
  withText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  projectName?: string;
  showProjectArrow?: boolean;
}

const Logo = ({
  withText = true,
  size = "md",
  className = "",
  projectName = "mizi",
  showProjectArrow = false
}: LogoProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isOutboundPage = location.pathname === "/outbound";
  const isLandingPage = location.pathname === "/landing";
  
  const sizeClasses = {
    sm: {
      fontSize: "1.25rem",
      logoSize: 20,
      spacing: "gap-0.5"
    },
    md: {
      fontSize: "1.5rem",
      logoSize: 24,
      spacing: "gap-1"
    },
    lg: {
      fontSize: "1.875rem",
      logoSize: 32,
      spacing: "gap-1.5"
    }
  };

  const textColor = isOutboundPage ? "text-minimal-white" : "text-minimal-black";

  // Set font size multiplier based on current route
  const fontSizeMultiplier = isLandingPage ? "0.75" : "0.55";

  return (
    <div className={`flex items-center ${className}`}>
      <Link to="/" className="flex items-center">
        <div className="flex items-center">
          <div className={`flex items-center ${sizeClasses[size].spacing}`}>
            <LogoIcon size={size} isOutboundPage={isOutboundPage} />
          </div>
        </div>
      </Link>
      {withText && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none" asChild>
            <div className="ml-2 flex items-center cursor-pointer">
              <span className={`font-semibold tracking-tight ${textColor}`} style={{
                fontSize: "calc(" + sizeClasses[size].fontSize + " * " + fontSizeMultiplier + ")"
              }}>
                {projectName}
              </span>
              {showProjectArrow && (
                <ChevronDown size={12} className={`ml-1 ${isOutboundPage ? "text-minimal-gray-400" : "text-minimal-gray-500"}`} />
              )}
            </div>
          </DropdownMenuTrigger>
          <LogoDropdownContent isOutboundPage={isOutboundPage} user={user} />
        </DropdownMenu>
      )}
    </div>
  );
};

export default Logo;
