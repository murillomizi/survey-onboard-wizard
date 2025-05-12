import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Building, User, Database, Check, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LogoIcon from "@/components/ui/logo/LogoIcon";
import CSVFileUpload from "@/components/survey/CSVFileUpload";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type FormData = {
  companyName: string;
  industry: string;
  companySize: string;
  companyDescription: string;
  personaRole: string;
  personaAge: string;
  personaChallenges: string;
  personaGoals: string;
};

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const steps = [
    { title: "Informações da Empresa", icon: <Building className="h-6 w-6" /> },
    { title: "Persona Ideal", icon: <User className="h-6 w-6" /> },
    { title: "Importar Prospects", icon: <Database className="h-6 w-6" /> },
  ];

  const handleNext = (data: FormData) => {
    // Avança para o próximo passo se não for o último
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
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
                      <Input 
                        id="industry" 
                        placeholder="Ex: Tecnologia, Saúde, Finanças..."
                        {...register("industry", { required: "Setor é obrigatório" })}
                      />
                      {errors.industry && (
                        <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="companySize">Tamanho da Empresa</Label>
                      <Input 
                        id="companySize" 
                        placeholder="Ex: 1-10, 11-50, 51-200..."
                        {...register("companySize", { required: "Tamanho da empresa é obrigatório" })}
                      />
                      {errors.companySize && (
                        <p className="text-red-500 text-xs mt-1">{errors.companySize.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="companyDescription">Descrição da Empresa</Label>
                      <Textarea 
                        id="companyDescription" 
                        placeholder="Descreva o que sua empresa faz, sua proposta de valor..."
                        className="min-h-[100px]"
                        {...register("companyDescription", { required: "Descrição é obrigatória" })}
                      />
                      {errors.companyDescription && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyDescription.message}</p>
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
                          Quanto mais detalhada for sua descrição da persona, mais personalizadas serão as mensagens geradas pela Mizi.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="personaRole">Cargo/Função</Label>
                      <Input 
                        id="personaRole" 
                        placeholder="Ex: Diretor de Marketing, CEO, Gerente de Vendas..."
                        {...register("personaRole", { required: "Cargo da persona é obrigatório" })}
                      />
                      {errors.personaRole && (
                        <p className="text-red-500 text-xs mt-1">{errors.personaRole.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="personaAge">Faixa Etária</Label>
                      <Input 
                        id="personaAge" 
                        placeholder="Ex: 25-35, 35-45..."
                        {...register("personaAge")}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="personaChallenges">Principais Desafios</Label>
                      <Textarea 
                        id="personaChallenges" 
                        placeholder="Quais são os principais problemas e desafios que sua persona enfrenta no dia a dia?"
                        className="min-h-[80px]"
                        {...register("personaChallenges", { required: "Desafios são obrigatórios" })}
                      />
                      {errors.personaChallenges && (
                        <p className="text-red-500 text-xs mt-1">{errors.personaChallenges.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="personaGoals">Objetivos</Label>
                      <Textarea 
                        id="personaGoals" 
                        placeholder="Quais são os principais objetivos profissionais da sua persona?"
                        className="min-h-[80px]"
                        {...register("personaGoals", { required: "Objetivos são obrigatórios" })}
                      />
                      {errors.personaGoals && (
                        <p className="text-red-500 text-xs mt-1">{errors.personaGoals.message}</p>
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
                  <Button type="submit" className="bg-minimal-black text-white hover:bg-minimal-gray-800">
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleComplete}
                    className="bg-minimal-black text-white hover:bg-minimal-gray-800"
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
