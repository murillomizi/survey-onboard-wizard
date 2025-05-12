
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import Logo from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/"); // Redirecting to the home page instead of /landing
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  // Redirect to outbound page if user is logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/outbound");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-minimal-white flex flex-col items-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-[1200px] flex justify-between items-center py-4">
        <Logo size="md" />
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          className="border-minimal-gray-300 hover:bg-minimal-gray-100"
        >
          Logout
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-[800px] text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Dashboard</h1>
        <p className="text-lg mb-8">Bem-vindo, {user?.email}</p>
        <div className="p-6 bg-minimal-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Detalhes do usuário</h2>
          <p className="mb-1"><strong>ID:</strong> {user?.id}</p>
          <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
          <p><strong>Último login:</strong> {new Date(user?.last_sign_in_at || "").toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
