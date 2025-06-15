import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import OutboundGenerator from "./pages/OutboundGenerator";
import OnboardingWizard from "./components/OnboardingWizard/OnboardingWizard";
import NotFound from "./pages/NotFound";
import SimpleHome from "./pages/SimpleHome";
import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import OutboundPage from "./pages/outbound";
import OnboardingSuccess from "./pages/onboarding-success";

// Create the client outside of the component
const queryClient = new QueryClient();

// Protected Route component to check authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/outbound/:surveyId" element={<OutboundPage />} />
              <Route path="/outbound" element={<OutboundGenerator />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/onboarding-success/:surveyId" element={<OnboardingSuccess />} />
              <Route 
                path="/simple" 
                element={
                  <ProtectedRoute>
                    <SimpleHome />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
