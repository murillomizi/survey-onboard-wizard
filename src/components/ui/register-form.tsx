
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para adicionar http:// ao início da URL se não existir
  const formatWebsiteUrl = (url: string) => {
    if (url && !url.match(/^https?:\/\//)) {
      return `http://${url}`;
    }
    return url;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName) newErrors.firstName = "Nome é obrigatório";
    if (!lastName) newErrors.lastName = "Sobrenome é obrigatório";
    if (!email) newErrors.email = "Email é obrigatório";
    if (!password) newErrors.password = "Senha é obrigatória";
    if (!companyWebsite) newErrors.companyWebsite = "Site da empresa é obrigatório";
    if (!jobTitle) newErrors.jobTitle = "Cargo é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Formata a URL antes de enviar
      const formattedWebsite = formatWebsiteUrl(companyWebsite);
      
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        company_website: formattedWebsite,
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

  // Manipulador específico para o campo de site da empresa
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyWebsite(value);
    
    // Limpa o erro assim que o usuário começa a digitar
    if (errors.companyWebsite) {
      setErrors(prev => ({ ...prev, companyWebsite: "" }));
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
                className={`pl-10 w-full ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
                className={`pl-10 w-full ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
              className={`pl-10 w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            className={`w-full ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
              type="text"
              placeholder="www.empresa.com"
              value={companyWebsite}
              onChange={handleWebsiteChange}
              required
              className={`pl-10 w-full ${errors.companyWebsite ? 'border-red-500' : ''}`}
            />
            {errors.companyWebsite && <p className="text-red-500 text-xs mt-1">{errors.companyWebsite}</p>}
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
              className={`pl-10 w-full ${errors.jobTitle ? 'border-red-500' : ''}`}
            />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
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
