
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Building, User, Database, Check, ArrowRight, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import LogoIcon from "@/components/ui/logo/LogoIcon";
import CSVFileUpload from "@/components/survey/CSVFileUpload";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type FormData = {
  companyName: string;
  industry: string;
  companySize: string;
  companyDescription: string[];
  personaRole: string;
  personaAge: string;
  personaChallenges: string[];
  personaGoals: string[];
};

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      companyDescription: [],
      personaChallenges: [],
      personaGoals: []
    }
  });

  const steps = [
    { title: "Informações da Empresa", icon: <Building className="h-6 w-6" /> },
    { title: "Persona Ideal", icon: <User className="h-6 w-6" /> },
    { title: "Importar Prospects", icon: <Database className="h-6 w-6" /> },
  ];

  const industries = [
    "Tecnologia",
    "Saúde",
    "Finanças",
    "Educação",
    "Varejo",
    "Manufatura",
    "Serviços",
    "Marketing",
    "Recursos Humanos"
  ];

  const companySizes = [
    "1-10 funcionários",
    "11-50 funcionários",
    "51-200 funcionários",
    "201-500 funcionários",
    "501-1000 funcionários",
    "1000+ funcionários"
  ];

  const companyTags = [
    "Inovação",
    "Qualidade",
    "Sustentabilidade",
    "Eficiência",
    "Flexibilidade",
    "Confiabilidade",
    "Acessibilidade",
    "Preço competitivo",
    "Atendimento personalizado",
    "Tecnologia de ponta",
    "Expertise no mercado",
    "Soluções integradas",
    "Escalabilidade",
    "Automação",
    "Segurança"
  ];

  const personaRoles = [
    "CEO / Diretor",
    "Gerente de Marketing",
    "Gerente de Vendas",
    "Gerente de TI",
    "Gerente de Recursos Humanos",
    "Gerente Financeiro",
    "Coordenador",
    "Analista",
    "Especialista",
    "Consultor"
  ];

  const personaAgeRanges = [
    "18-24 anos",
    "25-34 anos",
    "35-44 anos",
    "45-54 anos",
    "55-64 anos",
    "65+ anos"
  ];

  const challengeOptions = [
    "Aumentar vendas",
    "Reduzir custos",
    "Melhorar eficiência",
    "Encontrar talentos",
    "Integrar tecnologias",
    "Expandir mercado",
    "Melhorar comunicação",
    "Aumentar engajamento",
    "Gerenciar tempo",
    "Inovar produtos/serviços",
    "Qualificar leads",
    "Automatizar processos"
  ];

  const goalOptions = [
    "Crescimento da receita",
    "Lançamento de produto",
    "Expansão internacional", 
    "Melhoria de processos",
    "Transformação digital",
    "Redução de turnover",
    "Liderança de mercado",
    "Sustentabilidade",
    "Satisfação do cliente",
    "Desenvolvimento de equipe",
    "ROI em marketing",
    "Otimização de conversão"
  ];

  const handleNext = (data: FormData) => {
    // Avança para o próximo passo se não for o último
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
        description: `${files[0].name} foi carregado com sucesso.`,
      });
    }
  };

  const handleComplete = () => {
    // Verifica se um arquivo foi selecionado
    if (!fileSelected) {
      toast({
        title: "Erro",
        description: "Por favor, importe uma base de dados antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você pode processar os dados do CSV
    // Navegar para a página do dashboard após conclusão
    toast({
      title: "Onboarding concluído!",
      description: "Preparando sua experiência personalizada...",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-minimal-gray-100 flex flex-col">
      {/* Header com logo */}
      <header className="bg-minimal-white p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LogoIcon size="md" />
            <span className="font-semibold text-lg">Mizi AI</span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Mizi AI</h1>
          <p className="text-minimal-gray-600">
            Vamos configurar sua conta para criar mensagens personalizadas para seus prospects.
          </p>
        </div>

        {/* Indicador de progresso */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                    ${index === currentStep 
                      ? "border-minimal-black bg-minimal-black text-minimal-white" 
                      : index < currentStep 
                        ? "border-green-500 bg-green-500 text-minimal-white" 
                        : "border-minimal-gray-300 bg-minimal-white text-minimal-gray-600"}`}
                  >
                    {index < currentStep ? <Check className="h-5 w-5" /> : step.icon}
                  </div>
                  <span className="text-xs mt-2 text-minimal-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-green-500" : "bg-minimal-gray-300"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Formulário por etapas */}
        <Card className="shadow-lg border-minimal-gray-200">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Conte-nos sobre sua empresa para personalizarmos sua experiência."}
              {currentStep === 1 && "Defina sua persona ideal para melhor direcionamento das mensagens."}
              {currentStep === 2 && "Importe sua base de prospects para iniciar a personalização."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
              {/* Step 1: Informações da Empresa */}
              {currentStep === 0 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input 
                        id="companyName" 
                        placeholder="Ex: Mizi Tech Ltda."
                        {...register("companyName", { required: "Nome da empresa é obrigatório" })}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="industry">Setor/Indústria</Label>
                      <RadioGroup 
                        onValueChange={(value) => setValue("industry", value)}
                        className="grid grid-cols-3 gap-2 mt-2"
                      >
                        {industries.map((industry) => (
                          <div key={industry} className="flex items-center space-x-2 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                            <RadioGroupItem value={industry} id={`industry-${industry}`} />
                            <Label htmlFor={`industry-${industry}`} className="cursor-pointer text-sm">
                              {industry}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.industry && (
                        <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="companySize">Tamanho da Empresa</Label>
                      <RadioGroup 
                        onValueChange={(value) => setValue("companySize", value)}
                        className="grid grid-cols-2 gap-2 mt-2"
                      >
                        {companySizes.map((size) => (
                          <div key={size} className="flex items-center space-x-2 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                            <RadioGroupItem value={size} id={`size-${size}`} />
                            <Label htmlFor={`size-${size}`} className="cursor-pointer text-sm">
                              {size}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.companySize && (
                        <p className="text-red-500 text-xs mt-1">{errors.companySize.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="companyDescription" className="mb-2 block">
                        Palavras-chave que definem sua empresa
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {companyTags.map((tag) => (
                          <div
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`
                              px-3 py-1 rounded-full text-sm cursor-pointer transition-all
                              ${selectedTags.includes(tag) 
                                ? "bg-minimal-black text-minimal-white" 
                                : "bg-minimal-gray-200 text-minimal-gray-700 hover:bg-minimal-gray-300"}
                            `}
                          >
                            #{tag}
                          </div>
                        ))}
                      </div>
                      {selectedTags.length === 0 && (
                        <p className="text-red-500 text-xs mt-2">Selecione pelo menos uma palavra-chave</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Persona */}
              {currentStep === 1 && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-700 text-sm">Dica de Persona</h4>
                        <p className="text-sm text-blue-600">
                          Quanto mais específica for sua persona, mais personalizadas serão as mensagens geradas pela Mizi.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="personaRole">Cargo/Função</Label>
                      <RadioGroup 
                        onValueChange={(value) => setValue("personaRole", value)}
                        className="grid grid-cols-2 gap-2 mt-2"
                      >
                        {personaRoles.map((role) => (
                          <div key={role} className="flex items-center space-x-2 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                            <RadioGroupItem value={role} id={`role-${role}`} />
                            <Label htmlFor={`role-${role}`} className="cursor-pointer text-sm">
                              {role}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.personaRole && (
                        <p className="text-red-500 text-xs mt-1">{errors.personaRole.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="personaAge">Faixa Etária</Label>
                      <RadioGroup 
                        onValueChange={(value) => setValue("personaAge", value)}
                        className="grid grid-cols-3 gap-2 mt-2"
                      >
                        {personaAgeRanges.map((age) => (
                          <div key={age} className="flex items-center space-x-2 rounded-md border p-2 hover:bg-minimal-gray-100 cursor-pointer">
                            <RadioGroupItem value={age} id={`age-${age}`} />
                            <Label htmlFor={`age-${age}`} className="cursor-pointer text-sm">
                              {age}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="personaChallenges" className="mb-2 block">
                        Principais Desafios da Persona
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {challengeOptions.map((challenge) => (
                          <div
                            key={challenge}
                            onClick={() => handleChallengeToggle(challenge)}
                            className={`
                              px-3 py-2 rounded-md text-sm cursor-pointer transition-all flex items-center
                              ${selectedChallenges.includes(challenge) 
                                ? "bg-indigo-100 border border-indigo-300 text-indigo-800" 
                                : "bg-minimal-gray-100 border border-minimal-gray-200 text-minimal-gray-700 hover:bg-minimal-gray-200"}
                            `}
                          >
                            {selectedChallenges.includes(challenge) && (
                              <Check className="h-4 w-4 mr-1 text-indigo-600" />
                            )}
                            <span>{challenge}</span>
                          </div>
                        ))}
                      </div>
                      {selectedChallenges.length === 0 && (
                        <p className="text-red-500 text-xs mt-2">Selecione pelo menos um desafio</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="personaGoals" className="mb-2 block">
                        Objetivos da Persona
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {goalOptions.map((goal) => (
                          <div
                            key={goal}
                            onClick={() => handleGoalToggle(goal)}
                            className={`
                              px-3 py-2 rounded-md text-sm cursor-pointer transition-all flex items-center
                              ${selectedGoals.includes(goal) 
                                ? "bg-green-100 border border-green-300 text-green-800" 
                                : "bg-minimal-gray-100 border border-minimal-gray-200 text-minimal-gray-700 hover:bg-minimal-gray-200"}
                            `}
                          >
                            {selectedGoals.includes(goal) && (
                              <Check className="h-4 w-4 mr-1 text-green-600" />
                            )}
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                      {selectedGoals.length === 0 && (
                        <p className="text-red-500 text-xs mt-2">Selecione pelo menos um objetivo</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Importar Base */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-700 mb-2">
                      Hora da Mágica!
                    </h3>
                    <p className="text-indigo-600 mb-4">
                      Importe sua base de prospects e a Mizi AI irá criar mensagens personalizadas para cada um deles 
                      com base nas informações que você forneceu.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-indigo-500">
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Conversão melhorada
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Escalabilidade
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Economia de tempo
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-6 border-2 border-dashed border-minimal-gray-300 rounded-lg bg-minimal-gray-50">
                    <CSVFileUpload onFileSelect={handleFileSelect} />
                    
                    {fileSelected && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-center text-green-700 w-full">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span className="text-sm">{fileSelected.name} carregado com sucesso!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
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
                    type="submit" 
                    className="bg-minimal-black text-white hover:bg-minimal-gray-800"
                    disabled={
                      (currentStep === 0 && selectedTags.length === 0) ||
                      (currentStep === 1 && (selectedChallenges.length === 0 || selectedGoals.length === 0))
                    }
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleComplete}
                    className="bg-minimal-black text-white hover:bg-minimal-gray-800"
                    disabled={!fileSelected}
                  >
                    Concluir <Check className="ml-2 h-4 w-4" />
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
