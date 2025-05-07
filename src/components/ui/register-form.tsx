
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Loader, User, Building, AtSign, Globe, Briefcase } from "lucide-react";
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
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !companyWebsite || !jobTitle) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        company_website: companyWebsite,
        job_title: jobTitle
      });
      
      if (error) {
        toast.error(error.message || "Falha no cadastro");
        return;
      }
      
      toast.success("Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar sua conta.");
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro durante o cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 bg-minimal-white rounded-lg shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Criar Conta</h2>
        <button 
          onClick={onClose}
          className="text-minimal-gray-500 hover:text-minimal-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="block text-sm font-medium mb-1">
              Nome
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="firstName"
                type="text"
                placeholder="João"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Sobrenome
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="lastName"
                type="text"
                placeholder="Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Profissional
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="seu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Senha
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
          <Label htmlFor="companyWebsite" className="block text-sm font-medium mb-1">
            Site da Empresa
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="companyWebsite"
              type="url"
              placeholder="https://empresa.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              required
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
            Cargo
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="jobTitle"
              type="text"
              placeholder="Diretor de Vendas"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-minimal-black font-medium hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
