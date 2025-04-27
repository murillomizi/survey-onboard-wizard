
import React, { useRef, useEffect } from "react";
import Papa from 'papaparse';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { Progress } from "@/components/ui/progress";
import LoadingMessages from './LoadingMessages';
import ChatInput from "./ChatInput";
import { useSurveyState } from "@/hooks/useSurveyState";
import { steps } from "@/config/surveySteps";
import { Message } from "@/types/survey";
import { toast } from "@/hooks/use-toast";

const ChatbotSurvey = () => {
  const {
    currentStep,
    setCurrentStep,
    isWaitingForResponse,
    setIsWaitingForResponse,
    showOptions,
    setShowOptions,
    showSlider,
    setShowSlider,
    sliderValue,
    setSliderValue,
    isSubmitting,
    setIsSubmitting,
    csvFileName,
    setCsvFileName,
    showLoading,
    setShowLoading,
    processedCount,
    totalCount,
    surveyData,
    setSurveyData,
    checkProcessingProgress,
    handleSubmit: submitSurvey
  } = useSurveyState();

  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkProgressInterval = useRef<number | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    return () => {
      if (checkProgressInterval.current) {
        clearInterval(checkProgressInterval.current);
      }
    };
  }, []);

  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [...prev, { id: Date.now(), content, type }]);
  };

  const handleSendMessage = (input: string) => {
    if (!input.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = steps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(input, "user");
      setSurveyData({ ...surveyData, websiteUrl: input });
    }

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
        const summaryContent = (
          <div>
            <p><strong>Canal:</strong> {getOptionLabel("canal", surveyData.canal)}</p>
            <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", surveyData.funnelStage)}</p>
            <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
            <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
            <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", surveyData.tomVoz)}</p>
            <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", surveyData.gatilhos)}</p>
            <p>
              <strong>Arquivo CSV:</strong> {csvFileName ? 
                `${csvFileName} - ${surveyData.csvData.length} registros carregados` : 
                "Nenhum arquivo carregado"
              }
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

  const handleFinalSubmit = async () => {
    const result = await submitSurvey();
    if (result) {
      const { id, totalItems } = result;
      const surveyIdString = String(id);
      
      checkProgressInterval.current = setInterval(async () => {
        const isComplete = await checkProcessingProgress(surveyIdString, totalItems);
        
        if (isComplete) {
          clearInterval(checkProgressInterval.current!);
          setIsSubmitting(false);
          setShowLoading(false);
          toast({
            title: "Configurações salvas!",
            description: "Suas preferências de mensagem foram salvas com sucesso.",
          });
        }
      }, 1000);
    }
  };

  const progressPercentage = Math.min(((currentStep + 1) / steps.length) * 100, 100);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      {showLoading && <LoadingMessages processedCount={processedCount} totalCount={totalCount} />}
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
        
        <div ref={chatEndRef} />
      </div>
      
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <ChatInput
        currentStep={currentStep}
        showOptions={!!showOptions}
        showSlider={showSlider}
        onSendMessage={handleSendMessage}
        onFileUpload={() => fileInputRef.current?.click()}
        isSubmitting={isSubmitting}
        stepsLength={steps.length}
        handleSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default ChatbotSurvey;
