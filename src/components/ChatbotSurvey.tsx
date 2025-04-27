
import React, { useRef, useEffect } from "react";
import Papa from 'papaparse';
import { ArrowLeft } from "lucide-react"; // Fixed import
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import LoadingMessages from './LoadingMessages';
import { ChatInput } from './ChatInput';
import { useSurveyState } from '../hooks/useSurveyState';
import { steps } from '../config/surveySteps';

const ChatbotSurvey = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    setMessages,
    currentInput,
    setCurrentInput,
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
    csvFileName,
    setCsvFileName,
    showLoading,
    processedCount,
    totalCount,
    surveyData,
    setSurveyData,
    handleSubmit,
    webhookStatus,
    isProcessingComplete,
    downloadCsv
  } = useSurveyState();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content, type }
    ]);
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
      addMessage("Obrigado por completar a pesquisa! Clique em 'Comece' para prosseguir.", "bot");
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

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      {showLoading && (
        <LoadingMessages 
          processedCount={processedCount} 
          totalCount={totalCount} 
          webhookStatus={webhookStatus}
          isProcessingComplete={isProcessingComplete}
          onDownload={downloadCsv}
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
            {Math.round((currentStep + 1) / steps.length * 100)}% concluído
          </div>
        </div>
        <Progress value={(currentStep + 1) / steps.length * 100} className="h-1.5 bg-gray-100" />
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
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
            >
              {isSubmitting ? 'Processando...' : 'Comece'}
            </Button>
          )}

          <ChatInput
            currentInput={currentInput}
            onInputChange={setCurrentInput}
            onSend={handleSendMessage}
            onFileUpload={() => fileInputRef.current?.click()}
            showFileUpload={currentStep === 6}
            disabled={currentStep === steps.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
