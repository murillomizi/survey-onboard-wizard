
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Building, User, Database, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import LogoIcon from "@/components/ui/logo/LogoIcon";
import CSVFileUpload from "@/components/survey/CSVFileUpload";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type FormData = {
  industry: string;
  companySize: string;
  companyDescription: string[];
  personaRole: string;
  personaChallenges: string[];
  personaGoals: string[];
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      companyDescription: [],
      personaChallenges: [],
      personaGoals: []
    }
  });

  const steps = [
    { title: "Empresa", icon: <Building className="h-5 w-5" /> },
    { title: "Persona", icon: <User className="h-5 w-5" /> },
    { title: "Prospects", icon: <Database className="h-5 w-5" /> },
  ];

  const industries = [
    "Tecnologia",
    "Saúde",
    "Finanças",
    "Educação",
    "Varejo",
    "Manufatura"
  ];

  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201+"
  ];

  const companyTags = [
    "Inovação",
    "Qualidade",
    "Sustentabilidade",
    "Eficiência",
    "Tecnologia",
    "Expertise",
    "Automação",
    "Segurança"
  ];

  const personaRoles = [
    "CEO / Diretor",
    "Gerente",
    "Coordenador",
    "Analista",
    "Especialista"
  ];

  const challengeOptions = [
    "Aumentar vendas",
    "Reduzir custos",
    "Melhorar eficiência",
    "Encontrar talentos",
    "Expandir mercado",
    "Automatizar processos"
  ];

  const goalOptions = [
    "Crescimento da receita",
    "Lançamento de produto",
    "Transformação digital",
    "Liderança de mercado",
    "Satisfação do cliente",
    "ROI em marketing"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleTagToggle = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updatedTags);
    setValue("companyDescription", updatedTags);
  };

  const handleChallengeToggle = (challenge: string) => {
    const updated = selectedChallenges.includes(challenge)
      ? selectedChallenges.filter(c => c !== challenge)
      : [...selectedChallenges, challenge];
    
    setSelectedChallenges(updated);
    setValue("personaChallenges", updated);
  };

  const handleGoalToggle = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    
    setSelectedGoals(updated);
    setValue("personaGoals", updated);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileSelected(files[0]);
      toast({
        title: "Arquivo selecionado",
        description: `${files[0].name} foi carregado.`,
      });
    }
  };

  const handleComplete = () => {
    if (!fileSelected) {
      toast({
        title: "Erro",
        description: "Importe sua base de prospects.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Onboarding concluído!",
      description: "Preparando sua experiência...",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-minimal-white flex flex-col">
      {/* Header minimalista */}
      <header className="p-4 shadow-sm">
        <div className="container mx-auto flex items-center">
          <LogoIcon size="md" />
          <span className="font-medium ml-2">Mizi AI</span>
        </div>
      </header>

      {/* Conteúdo principal simplificado */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium">Configure sua conta</h1>
        </div>

        {/* Indicador de progresso simplificado */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${index === currentStep 
                    ? "bg-minimal-black text-minimal-white" 
                    : index < currentStep 
                      ? "bg-minimal-gray-400 text-minimal-white" 
                      : "bg-minimal-gray-200 text-minimal-gray-600"}`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${index < currentStep ? "bg-minimal-gray-400" : "bg-minimal-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário simplificado */}
        <Card className="border-minimal-gray-200">
          <CardHeader>
            <h2 className="text-lg font-medium">{steps[currentStep].title}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
              {/* Step 1: Empresa - Simplificado */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Setor</Label>
                    <RadioGroup 
                      onValueChange={(value) => setValue("industry", value)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {industries.map((industry) => (
                        <div key={industry} className="flex items-center space-x-1 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                          <RadioGroupItem value={industry} id={`industry-${industry}`} />
                          <Label htmlFor={`industry-${industry}`} className="cursor-pointer text-sm">
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Tamanho</Label>
                    <RadioGroup 
                      onValueChange={(value) => setValue("companySize", value)}
                      className="grid grid-cols-4 gap-2"
                    >
                      {companySizes.map((size) => (
                        <div key={size} className="flex items-center justify-center rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                          <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                          <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm">
                            {size}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="companyDescription" className="mb-2 block">
                      Palavras-chave
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {companyTags.map((tag) => (
                        <div
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`
                            px-3 py-1 rounded-full text-sm cursor-pointer transition-all
                            ${selectedTags.includes(tag) 
                              ? "bg-minimal-black text-minimal-white" 
                              : "bg-minimal-gray-200 text-minimal-gray-700"}
                          `}
                        >
                          #{tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Persona - Simplificado */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Cargo</Label>
                    <RadioGroup 
                      onValueChange={(value) => setValue("personaRole", value)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {personaRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-1 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                          <RadioGroupItem value={role} id={`role-${role}`} />
                          <Label htmlFor={`role-${role}`} className="cursor-pointer text-sm">
                            {role}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="personaChallenges" className="mb-2 block">
                      Desafios
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {challengeOptions.map((challenge) => (
                        <div
                          key={challenge}
                          onClick={() => handleChallengeToggle(challenge)}
                          className={`
                            px-3 py-2 rounded-md text-sm cursor-pointer transition-all flex items-center
                            ${selectedChallenges.includes(challenge) 
                              ? "bg-minimal-gray-200 border border-minimal-gray-300 text-minimal-black" 
                              : "bg-minimal-white border border-minimal-gray-200 text-minimal-gray-700"}
                          `}
                        >
                          {selectedChallenges.includes(challenge) && (
                            <Check className="h-3 w-3 mr-1 text-minimal-black" />
                          )}
                          <span>{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="personaGoals" className="mb-2 block">
                      Objetivos
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {goalOptions.map((goal) => (
                        <div
                          key={goal}
                          onClick={() => handleGoalToggle(goal)}
                          className={`
                            px-3 py-2 rounded-md text-sm cursor-pointer transition-all flex items-center
                            ${selectedGoals.includes(goal) 
                              ? "bg-minimal-gray-200 border border-minimal-gray-300 text-minimal-black" 
                              : "bg-minimal-white border border-minimal-gray-200 text-minimal-gray-700"}
                          `}
                        >
                          {selectedGoals.includes(goal) && (
                            <Check className="h-3 w-3 mr-1 text-minimal-black" />
                          )}
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Importar Base - Simplificado */}
              {currentStep === 2 && (
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-minimal-gray-300 rounded-lg bg-minimal-gray-50">
                  <CSVFileUpload onFileSelect={handleFileSelect} />
                  
                  {fileSelected && (
                    <div className="mt-4 p-3 bg-minimal-gray-100 border rounded-md flex items-center text-minimal-gray-700 w-full">
                      <Check className="h-4 w-4 mr-2 text-minimal-black" />
                      <span className="text-sm">{fileSelected.name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Botões de navegação simplificados */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  className="border-minimal-gray-300"
                >
                  Voltar
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="bg-minimal-black text-white hover:bg-minimal-gray-800"
                  >
                    Avançar <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleComplete}
                    className="bg-minimal-black text-white hover:bg-minimal-gray-800"
                    disabled={!fileSelected}
                  >
                    Concluir <Check className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Onboarding;
