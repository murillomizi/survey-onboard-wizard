
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/" 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Você precisa estar logado para acessar esta página");
    }
  }, [user, loading]);

  if (loading) {
    // While checking authentication status, show a minimal loading state
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <div className="h-4 w-24 bg-minimal-gray-200 rounded-full mx-auto mb-2"></div>
          <div className="h-2 w-16 bg-minimal-gray-100 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // User is not authenticated, redirect to the specified route
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
