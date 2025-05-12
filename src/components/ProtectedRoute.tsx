
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectPath = "/" 
}) => {
  const { user, loading } = useAuth();

  // While checking authentication status, show nothing or a loading indicator
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-minimal-black"></div>
    </div>;
  }
  
  // If not authenticated, redirect to the specified path
  if (!user) {
    console.log("User not authenticated, redirecting to", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};
