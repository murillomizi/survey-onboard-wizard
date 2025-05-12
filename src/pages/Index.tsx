
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginDialog } from "@/components/ui/login-dialog";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/logo";

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLoginOpenChange = (open: boolean) => {
    setLoginOpen(open);
    if (!open) {
      // Redireciona para a página principal quando fechar o diálogo
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-minimal-gray-100">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={handleLoginOpenChange} 
        initialTab="login" 
      />
    </div>
  );
};

export default Index;
