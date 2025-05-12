
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Database, Copy, Edit, LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
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

  // Set logo color based on current route
  const logoColor = isOutboundPage ? "#FFFFFF" : "#000000";
  const textColor = isOutboundPage ? "text-minimal-white" : "text-minimal-black";

  // Set font size multiplier based on current route
  const fontSizeMultiplier = isLandingPage ? "0.75" : "0.55";
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/"); // Redirecting to the home page instead of /landing
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Link to="/" className="flex items-center">
        <div className="flex items-center">
          <div className={`flex items-center ${sizeClasses[size].spacing}`}>
            <svg width={sizeClasses[size].logoSize} height={sizeClasses[size].logoSize} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
              <defs>
                <linearGradient id="miziGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={logoColor} />
                  <stop offset="50%" stopColor={isOutboundPage ? "#C8C8C9" : "#8E9196"} />
                  <stop offset="100%" stopColor={isOutboundPage ? "#8E9196" : "#C8C8C9"} />
                </linearGradient>
              </defs>
              <path d="M165.712 34.288C172.945 41.522 173.511 52.568 167.088 60.555L114.823 124.784L167.088 189.014C173.511 197.001 172.945 208.047 165.712 215.28C158.478 222.514 147.432 223.08 139.445 216.657L80.664 169.527L21.884 216.657C13.897 223.08 2.851 222.514 -4.383 215.28C-11.616 208.047 -12.183 197.001 -5.759 189.014L46.504 124.784L-5.759 60.555C-12.183 52.568 -11.616 41.522 -4.383 34.288C2.851 27.055 13.897 26.489 21.884 32.912L80.664 80.042L139.445 32.912C147.432 26.489 158.478 27.055 165.712 34.288Z" fill="url(#miziGradient)" transform="scale(0.8) translate(20, 10)" />
            </svg>
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
          <DropdownMenuContent align="start" className={`w-80 p-0 ${isOutboundPage ? "bg-minimal-gray-800 border-minimal-gray-700" : "bg-white border-minimal-gray-200"}`}>
            {/* User Profile Section */}
            {user && (
              <>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      <UserRound size={20} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${isOutboundPage ? "text-minimal-white" : "text-minimal-gray-900"}`}>
                        {user.email}
                      </span>
                      <span className={`text-xs ${isOutboundPage ? "text-minimal-gray-400" : "text-minimal-gray-500"}`}>
                        Último acesso: {new Date(user.last_sign_in_at || "").toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
              </>
            )}
            
            {/* Dashboard Button */}
            <div className="p-2">
              <Link to="/dashboard">
                <DropdownMenuItem className={`px-3 py-2.5 rounded-md ${isOutboundPage ? "hover:bg-minimal-gray-700 text-minimal-white" : "hover:bg-minimal-gray-100 text-minimal-gray-900"}`}>
                  <div className="flex items-center gap-2">
                    <Database size={16} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
                    <span>Dashboard</span>
                  </div>
                </DropdownMenuItem>
              </Link>
            </div>
            
            <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
            
            {/* Usage Limits */}
            <div className={`p-3 ${isOutboundPage ? "border-minimal-gray-700 text-minimal-gray-300" : "border-minimal-gray-200 text-minimal-gray-600"}`}>
              <h4 className={`text-xs font-medium mb-2 ${isOutboundPage ? "text-minimal-gray-300" : "text-minimal-gray-600"}`}>Usage Limits</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Prospects used:</span>
                  <span className="font-medium">48 / 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '48%' }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>API Requests:</span>
                  <span className="font-medium">324 / 1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '32.4%' }}></div>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator className={isOutboundPage ? "bg-minimal-gray-700" : "bg-minimal-gray-200"} />
            
            {/* Project Actions */}
            <div className="p-2">
              <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700 text-minimal-white" : "hover:bg-minimal-gray-100 text-minimal-gray-900"}`}>
                <div className="flex items-center gap-2">
                  <Edit size={16} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
                  <span>Rename Project</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700 text-minimal-white" : "hover:bg-minimal-gray-100 text-minimal-gray-900"}`}>
                <div className="flex items-center gap-2">
                  <Copy size={16} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
                  <span>Duplicate Project</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700 text-minimal-white" : "hover:bg-minimal-gray-100 text-minimal-gray-900"}`}>
                <div className="flex items-center gap-2">
                  <span>Create New Project</span>
                </div>
              </DropdownMenuItem>
              
              {/* Logout Button */}
              {user && (
                <DropdownMenuItem 
                  className={`px-3 py-2 rounded-md text-sm ${isOutboundPage ? "hover:bg-minimal-gray-700 text-destructive" : "hover:bg-minimal-gray-100 text-destructive"}`}
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} className="text-destructive" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Logo;
