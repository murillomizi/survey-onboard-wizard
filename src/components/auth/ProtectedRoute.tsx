
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/"
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You can show a loading spinner here if needed
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};
