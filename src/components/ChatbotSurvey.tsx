import React, { useState, useRef, useEffect } from "react";
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Send, Paperclip, ArrowLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "./LoadingOverlay";

interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}

const ChatbotSurvey = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  const [surveyData, setSurveyData] = useState({
    canal: "",
    funnelStage: "",
    csvData: [] as any[],
    websiteUrl: "",
    tamanho: 350,
    tomVoz: "",
    gatilhos: ""
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  const steps = [
    {
      question: "Olá! Vamos configurar sua sequência de mensagens. Escolha o canal para sua comunicação:",
      options: [
        { value: "linkedin", label: "LinkedIn" },
        { value: "cold-email", label: "Cold E-mail" }
      ],
      field: "canal"
    },
    {
      question: "Em que estágio do funil de vendas está sua base de contatos?",
      options: [
        { value: "topo", label: "Topo de Funil" },
        { value: "meio", label: "Meio de Funil" },
        { value: "fim", label: "Fim de Funil" },
        { value: "cliente", label: "Cliente Existente" },
        { value: "inbound", label: "Leads de Ação de Inbound" }
      ],
      field: "funnelStage"
    },
    {
      question: "Qual é o site da sua empresa?",
      field: "websiteUrl",
      inputType: "text"
    },
    {
      question: "Vamos definir o tamanho da sua mensagem. Mova o controle deslizante para escolher o número de caracteres (recomendado: 350-500 caracteres para maior impacto):",
      field: "tamanho",
      inputType: "slider"
    },
    {
      question: "Qual tom de voz você prefere para suas mensagens?",
      options: [
        { value: "formal", label: "Formal" },
        { value: "informal", label: "Informal" },
        { value: "neutro", label: "Neutro" },
        { value: "consultivo", label: "Consultivo" },
        { value: "curioso", label: "Curioso" },
        { value: "inovador", label: "Inovador" }
      ],
      field: "tomVoz"
    },
    {
      question: "Por último, gostaria de aplicar algum gatilho de persuasão?",
      options: [
        { value: "sem-gatilho", label: "Sem gatilho" },
        { value: "reciprocidade", label: "Reciprocidade" },
        { value: "compromisso", label: "Compromisso e Consistência" },
        { value: "prova-social", label: "Prova Social" },
        { value: "simpatia", label: "Simpatia" },
        { value: "autoridade", label: "Autoridade" },
        { value: "escassez", label: "Escassez" },
        { value: "consenso", label: "Consenso" }
      ],
      field: "gatilhos"
    },
    {
      question: "Agora, você pode fazer upload da sua base de prospecção em formato CSV. Quanto mais dados você fornecer, mais personalizada e precisa será a análise da IA!",
      description: "Dica: Inclua o máximo de informações possível, como nome, cargo, empresa, e-mail, histórico de interações, etc. Dados completos permitem que a IA crie estratégias de comunicação extremamente personalizadas e relevantes.",
      field: "csvFile",
      inputType: "file"
    },
    {
      question: "Perfeito! Aqui está o resumo das suas escolhas:",
      field: "summary",
      inputType: "summary"
    }
  ];

  const progressPercentage = Math.min(((currentStep + 1) / steps.length) * 100, 100);

  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), content, type }
    ]);
  };

  useEffect(() => {
    if (messages.length === 0) {
      const firstStep = steps[0];
      addMessage(firstStep.question, "bot");
      
      if (firstStep.options) {
        setShowOptions({
          options: firstStep.options,
          step: 0
        });
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (!currentInput.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = steps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(currentInput, "user");
      setSurveyData({ ...surveyData, websiteUrl: currentInput });
    }

    setCurrentInput("");

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleOptionSelect = (value: string) => {
    if (!showOptions) return;
    
    const selectedOption = showOptions.options.find(opt => opt.value === value);
    if (!selectedOption) return;

    setShowOptions(null);
    setIsWaitingForResponse(true);

    addMessage(selectedOption.label, "user");

    const fieldName = steps[currentStep].field as keyof typeof surveyData;
    setSurveyData(prev => ({ ...prev, [fieldName]: value }));

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleSliderChange = (val: number[]) => {
    setSliderValue(val[0]);
  };

  const handleSliderComplete = () => {
    addMessage(`${sliderValue} caracteres`, "user");
    setSurveyData({ ...surveyData, tamanho: sliderValue });
    setShowSlider(false);
    setIsWaitingForResponse(true);

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }
    
    if (file) {
      setCsvFileName(file.name);

      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const filteredData = results.data.filter(row => 
              row && typeof row === 'object' && Object.keys(row).length > 0
            );
            
            if (filteredData.length > 0) {
              addMessage(`Arquivo processado com sucesso: ${filteredData.length} linhas carregadas`, "user");
              setSurveyData(prev => ({
                ...prev,
                csvData: filteredData
              }));
              
              console.log('CSV data processed:', filteredData.length, 'rows');
              
              setIsWaitingForResponse(true);
              setTimeout(() => {
                setIsWaitingForResponse(false);
                moveToNextStep();
              }, 1000);
            } else {
              toast({
                title: "Arquivo vazio",
                description: "O arquivo CSV não contém dados válidos.",
                variant: "destructive"
              });
            }
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível ler o arquivo CSV. Verifique se o formato está correto.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      addMessage(steps[nextStep].question, "bot");
      
      if (steps[nextStep].options) {
        setShowOptions({
          options: steps[nextStep].options,
          step: nextStep
        });
      }
      
      if (steps[nextStep].inputType === "slider") {
        setShowSlider(true);
      }
      
      if (steps[nextStep].inputType === "summary") {
        const csvInfo = csvFileName
          ? `${csvFileName} (${surveyData.csvData.length} registros)`
          : "Nenhum arquivo carregado";

        const summaryContent = (
          <div>
            <p><strong>Canal:</strong> {getOptionLabel("canal", surveyData.canal)}</p>
            <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", surveyData.funnelStage)}</p>
            <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
            <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
            <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", surveyData.tomVoz)}</p>
            <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", surveyData.gatilhos)}</p>
            <p>
              <strong>Arquivo CSV:</strong> {csvInfo}
            </p>
          </div>
        );
        addMessage(summaryContent, "bot");
        
        setTimeout(() => {
          addMessage("Tudo pronto para continuar?", "bot");
        }, 1000);
      }
    } else {
      addMessage("Obrigado por completar a pesquisa! Clique em 'Continuar' para prosseguir.", "bot");
    }
  };

  const getOptionLabel = (field: string, value: string): string => {
    const step = steps.find(s => s.field === field);
    if (!step || !step.options) return value;
    
    const option = step.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleBack = () => {
    if (currentStep <= 0) return;
    
    setMessages(prev => prev.slice(0, -2));
    
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    
    setShowOptions(null);
    setShowSlider(false);
    setCurrentInput("");
    
    const prevStepData = steps[previousStep];
    if (prevStepData.options) {
      setShowOptions({
        options: prevStepData.options,
        step: previousStep
      });
    } else if (prevStepData.inputType === "slider") {
      setShowSlider(true);
    }
  };
  
  const checkProgress = async (surveyId: string) => {
    try {
      console.log(`Checking progress via Edge Function for survey ID: ${surveyId}, Timestamp: ${new Date().toISOString()}`);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId }
      });
      
      console.log('Edge Function response:', data);
      
      if (error) {
        console.error("Error calling checkProgress Edge Function:", error);
        return;
      }

      if (data) {
        const count = data.count || 0;
        setProcessedCount(count);
        console.log(`Processed ${count}/${surveyData.csvData.length} records (via Edge Function)`);
        
        if (count >= surveyData.csvData.length && count > 0) {
          console.log("Processing complete! Setting isProcessingComplete to true");
          setIsProcessingComplete(true);
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };
  
  const handleDownload = async () => {
    if (!processingId) {
      console.error("Cannot download: No processing ID available");
      return;
    }
    
    try {
      console.log("Fetching processed data for download for ID:", processingId);
      const { data, error } = await supabase
        .from("mizi_ai_personalized_return")
        .select("*")
        .eq("mizi_ai_id", processingId);
      
      if (error) {
        console.error("Error fetching processed data:", error);
        toast({
          title: "Erro ao baixar",
          description: "Não foi possível baixar os resultados processados.",
          variant: "destructive"
        });
        return;
      }
      
      if (!data || data.length === 0) {
        console.error("No data found for download");
        toast({
          title: "Sem dados",
          description: "Não há dados processados disponíveis para download.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Generating CSV with", data.length, "rows");
      const csv = Papa.unparse(data);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campanha_personalizada_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Sua campanha personalizada está sendo baixada.",
      });
      
    } catch (error) {
      console.error("Error in handleDownload:", error);
      toast({
        title: "Erro ao baixar",
        description: "Ocorreu um erro ao tentar baixar o arquivo.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!surveyData.canal || !surveyData.funnelStage) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!surveyData.csvData || surveyData.csvData.length === 0) {
        toast({
          title: "Dados insuficientes",
          description: "Por favor, faça upload de um arquivo CSV com dados para processar.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Starting processing, showing loading overlay...");
      setIsProcessing(true);
      
      try {
        const { data, error } = await supabase
          .from('mizi_ai_surveys')
          .insert([
            {
              canal: surveyData.canal,
              funnel_stage: surveyData.funnelStage,
              website_url: surveyData.websiteUrl,
              message_length: surveyData.tamanho,
              tone_of_voice: surveyData.tomVoz,
              persuasion_trigger: surveyData.gatilhos,
              csv_data: surveyData.csvData
            }
          ])
          .select();
  
        if (error) {
          console.error('Error saving survey:', error);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar suas respostas. Tente novamente.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          setIsProcessing(false);
          return;
        }
  
        toast({
          title: "Configurações salvas!",
          description: "Suas preferências de mensagem foram salvas com sucesso.",
        });
        
        console.log('Survey data saved:', data);
  
        if (data && data.length > 0) {
          const surveyId = data[0].id;
          console.log("Survey saved with ID:", surveyId);
          setProcessingId(surveyId);
          
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
          }
          
          pollingRef.current = window.setInterval(() => {
            checkProgress(surveyId);
          }, 2000);
        }
        
      } catch (error) {
        console.error('Error in form submission:', error);
        toast({
          title: "Erro ao processar",
          description: "Ocorreu um erro inesperado ao processar sua solicitação.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      {isProcessing && (
        <LoadingOverlay 
          processedCount={processedCount}
          totalCount={surveyData.csvData.length}
          isComplete={isProcessingComplete}
          onDownload={handleDownload}
          surveyId={processingId}
        />
      )}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Voltar para a pergunta anterior"
              >
                <ArrowLeft size={16} className="text-gray-500" />
              </Button>
            )}
            <div className="text-sm font-medium text-gray-600">
              Passo {currentStep + 1} de {steps.length}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(progressPercentage)}% concluído
          </div>
        </div>
        <Progress value={progressPercentage} className="h-1.5 bg-gray-100" />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-hide max-w-[600px] mx-auto w-full">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            type={message.type}
          />
        ))}
        
        {isWaitingForResponse && (
          <ChatMessage content="" type="bot" isTyping={true} />
        )}
        
        {showOptions && (
          <div className="mb-4">
            <ChatOptions
              options={showOptions.options}
              onSelect={handleOptionSelect}
            />
          </div>
        )}
        
        {showSlider && (
          <div className="mb-4 p-4 border border-gray-200 bg-white rounded-xl shadow-sm">
            <div className="mb-2">
              <span className="text-gray-800">{sliderValue} caracteres</span>
            </div>
            <Slider
              defaultValue={[350]}
              max={1000}
              min={100}
              step={10}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              className="mb-2"
            />
            <p className="text-gray-500 text-sm mt-1 italic">
              Recomendado: 350-500 caracteres para maior impacto
            </p>
            <Button 
              onClick={handleSliderComplete}
              className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200"
            >
              Confirmar
            </Button>
          </div>
        )}
        
        {currentStep === 7 && (
          <div className="mb-4 border border-blue-100 bg-blue-50 p-4 rounded-xl text-gray-700">
            <p className="font-semibold mb-2">🚀 Maximize a Personalização da IA</p>
            <p className="text-sm mb-2">
              Quanto mais dados você incluir no seu CSV, mais precisa e personalizada será a estratégia de comunicação.
            </p>
            <p className="text-xs text-gray-500 italic">
              Exemplos de dados úteis: nome completo, cargo, empresa, e-mail, histórico de interações, principais desafios, interesses profissionais, etc.
            </p>
          </div>
        )}
        
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex items-center gap-2 max-w-[600px] mx-auto">
          {currentStep === 6 && (
            <Button
              type="button"
              onClick={triggerFileUpload}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
            >
              <Paperclip size={18} />
              Upload CSV
            </Button>
          )}
          
          {currentStep < 6 && showOptions === null && !showSlider && (
            <>
              <div className="relative flex-1">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Digite sua resposta..."
                  className="w-full bg-gray-50 border-gray-200 text-gray-800 rounded-full pr-12 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-all duration-200"
                />
                <Button
                  onClick={handleSendMessage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 p-0"
                >
                  <Send size={14} />
                </Button>
              </div>
            </>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
            >
              {isSubmitting ? 'Salvando...' : 'Continuar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
