
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterFormProps {
  onClose: () => void;
  className?: string;
  switchToLogin: () => void;
}

export function RegisterForm({ onClose, className, switchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, data } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message || "Falha no registro");
        return;
      }
      
      // Redirect to email confirmation page
      toast.success("Registro realizado com sucesso!");
      navigate("/email-confirmation");
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro durante o registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 bg-minimal-white rounded-lg shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <button 
          onClick={onClose}
          className="text-minimal-gray-500 hover:text-minimal-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-minimal-black font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
