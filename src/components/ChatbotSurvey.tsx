import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

import { useChatMessages } from "@/hooks/useChatMessages";
import { useSurveyProgress } from "@/hooks/useSurveyProgress";
import { useSurveyData } from "@/hooks/useSurveyData";

import SurveyHeader from "./survey/SurveyHeader";
import SurveyContent from "./survey/SurveyContent";
import SurveyFooter from "./survey/SurveyFooter";
import FileHandler from "./survey/FileHandler";

interface ChatbotSurveyProps {
  initialSurveyId?: string | null;
  onSubmitSuccess?: (surveyId: string) => void;
}

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

const ChatbotSurvey: React.FC<ChatbotSurveyProps> = ({ 
  initialSurveyId = null, 
  onSubmitSuccess 
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [currentInput, setCurrentInput] = React.useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(350);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingPastChat, setIsLoadingPastChat] = React.useState(false);
  const pollingRef = React.useRef<number | null>(null);

  const { messages, setMessages, addMessage } = useChatMessages();
  const { surveyData, setSurveyData, csvFileName, csvRowCount, handleFileUpload } = useSurveyData();
  const { progress, setProgress, checkProgress } = useSurveyProgress(() => {
    addMessage(
      <div className="space-y-2">
        <p className="font-medium">🎉 Processamento concluído!</p>
        <p className="text-gray-600">
          Todos os {progress.processedCount} contatos foram processados com sucesso.
        </p>
        <Button
          onClick={handleDownload}
          disabled={progress.isDownloading}
          className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
        >
          {progress.isDownloading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Gerando arquivo...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Baixar Campanha Personalizada
            </>
          )}
        </Button>
      </div>,
      "bot"
    );
  });

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialSurveyId) {
      loadPastSurvey(initialSurveyId);
    } else if (!isLoadingPastChat) {
      initializeChat();
    }
  }, [initialSurveyId]);

  const loadPastSurvey = async (surveyId: string) => {
    try {
      setIsLoadingPastChat(true);
      setMessages([]);

      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .select('*')
        .eq('id', surveyId)
        .single();
      
      if (error) {
        console.error("Error fetching survey:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar este chat.",
          variant: "destructive"
        });
        setIsLoadingPastChat(false);
        return;
      }
      
      if (data) {
        const csvDataArray = Array.isArray(data.csv_data) ? data.csv_data : [];
        
        setSurveyData({
          canal: data.canal || "",
          funnelStage: data.funnel_stage || "",
          csvData: csvDataArray,
          websiteUrl: data.website_url || "",
          tamanho: data.message_length || 350,
          tomVoz: data.tone_of_voice || "",
          gatilhos: data.persuasion_trigger || ""
        });
        
        setProcessingId(data.id);
        
        if (csvDataArray.length > 0) {
          setCsvRowCount(csvDataArray.length);
        }
        
        const { data: progressData } = await supabase.functions.invoke('checkProgress', {
          body: { surveyId: data.id }
        });
        
        addMessage("Olá! Vamos configurar sua sequência de mensagens. Escolha o canal para sua comunicação:", "bot");
        addMessage(getOptionLabel("canal", data.canal), "user");
        
        addMessage("Em que estágio do funil de vendas está sua base de contatos?", "bot");
        addMessage(getOptionLabel("funnelStage", data.funnel_stage), "user");
        
        addMessage("Qual é o site da sua empresa?", "bot");
        addMessage(data.website_url, "user");
        
        addMessage("Vamos definir o tamanho da sua mensagem. Mova o controle deslizante para escolher o número de caracteres (recomendado: 350-500 caracteres para maior impacto):", "bot");
        addMessage(`${data.message_length} caracteres`, "user");
        
        addMessage("Qual tom de voz você prefere para suas mensagens?", "bot");
        addMessage(getOptionLabel("tomVoz", data.tone_of_voice), "user");
        
        addMessage("Por último, gostaria de aplicar algum gatilho de persuasão?", "bot");
        addMessage(getOptionLabel("gatilhos", data.persuasion_trigger), "user");
        
        addMessage("Agora, você pode fazer upload da sua base de prospecção em formato CSV. Quanto mais dados você fornecer, mais personalizada e precisa será a análise da IA!", "bot");
        
        if (csvDataArray.length > 0) {
          addMessage(`Arquivo processado com sucesso: ${csvDataArray.length} linhas carregadas`, "user");
        } else {
          addMessage("Nenhum arquivo CSV carregado", "user");
        }
        
        const csvInfo = csvDataArray.length > 0
          ? `${csvDataArray.length} registros`
          : "Nenhum arquivo carregado";
        
        const summaryContent = (
          <div>
            <p><strong>Canal:</strong> {getOptionLabel("canal", data.canal)}</p>
            <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", data.funnel_stage)}</p>
            <p><strong>Site:</strong> {data.website_url}</p>
            <p><strong>Tamanho:</strong> {data.message_length} caracteres</p>
            <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", data.tone_of_voice)}</p>
            <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", data.persuasion_trigger)}</p>
            <p>
              <strong>Arquivo CSV:</strong> {csvInfo}
            </p>
          </div>
        );
        addMessage(summaryContent, "bot");
        
        setCurrentStep(steps.length - 1);
        
        if (progressData && progressData.isComplete) {
          addMessage(
            <div className="space-y-2">
              <p className="font-medium">🎉 Processamento concluído!</p>
              <p className="text-gray-600">
                Todos os {progressData.count} contatos foram processados com sucesso.
              </p>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              >
                {isDownloading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Gerando arquivo...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Campanha Personalizada
                  </>
                )}
              </Button>
            </div>,
            "bot"
          );
        } else {
          addMessage("Clique em 'Consultar Status' para verificar o andamento do processamento.", "bot");
        }
      }
    } catch (error) {
      console.error("Error loading past survey:", error);
    } finally {
      setIsLoadingPastChat(false);
    }
  };

  const initializeChat = () => {
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

  const handleFileChange = async (file: File) => {
    const success = await handleFileUpload(file);
    if (success) {
      addMessage(`Arquivo processado com sucesso: ${csvRowCount} linhas carregadas`, "user");
      setIsWaitingForResponse(true);
      setTimeout(() => {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }, 1000);
    }
  };

  const handleDownload = async () => {
    if (!progress.processingId) {
      console.error("Cannot download: No processing ID available");
      toast({
        title: "Erro no download",
        description: "ID de processamento não disponível. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setProgress(prev => ({ ...prev, isDownloading: true }));
      console.log("Iniciando download para ID:", progress.processingId);
      
      toast({
        title: "Preparando download",
        description: "Aguarde enquanto preparamos seus dados para download...",
      });
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { 
          surveyId: progress.processingId,
          fetchData: true
        }
      });
      
      if (error || !data?.processedData || data.processedData.length === 0) {
        throw new Error(error?.message || "No data found for download");
      }
      
      console.log("Generating CSV with", data.processedData.length, "rows");
      const csv = Papa.unparse(data.processedData);
      
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
    } finally {
      setProgress(prev => ({ ...prev, isDownloading: false }));
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
      
      if (!Array.isArray(surveyData.csvData) || surveyData.csvData.length === 0) {
        toast({
          title: "Dados insuficientes",
          description: "Por favor, faça upload de um arquivo CSV com dados para processar.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('mizi_ai_surveys')
          .insert([{
            canal: surveyData.canal,
            funnel_stage: surveyData.funnelStage,
            website_url: surveyData.websiteUrl,
            message_length: surveyData.tamanho,
            tone_of_voice: surveyData.tomVoz,
            persuasion_trigger: surveyData.gatilhos,
            csv_data: surveyData.csvData
          }])
          .select();
  
        if (error) {
          console.error('Error saving survey:', error);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar suas respostas. Tente novamente.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
  
        if (data && data.length > 0) {
          const surveyId = data[0].id;
          console.log("Survey saved with ID:", surveyId);
          setProcessingId(surveyId);
          
          if (onSubmitSuccess) {
            onSubmitSuccess(surveyId);
          }
          
          addMessage(
            <div className="space-y-2">
              <p className="font-medium">✨ Processamento iniciado com sucesso!</p>
              <p className="text-gray-600">ID do processamento: {surveyId}</p>
              <p className="text-sm text-gray-500">
                Você pode perguntar sobre o status do processamento a qualquer momento. 
                Assim que o processamento for concluído, você será notificado aqui no chat.
              </p>
            </div>,
            "bot"
          );

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
    }
  };

  const handleCheckStatus = async () => {
    if (!progress.processingId) {
      addMessage(
        "Nenhum processamento em andamento. Por favor, inicie um novo processamento.",
        "bot"
      );
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId: progress.processingId }
      });
      
      if (error) {
        console.error("Error checking progress:", error);
        addMessage(
          "Erro ao verificar o status do processamento. Tente novamente.",
          "bot"
        );
        return;
      }
      
      const count = data?.count || 0;
      addMessage(
        `Status do processamento: ${count}/${csvRowCount} contatos processados.`,
        "bot"
      );
      
      if (count >= csvRowCount && csvRowCount > 0) {
        addMessage(
          <div className="space-y-2">
            <p className="font-medium">🎉 Processamento concluído!</p>
            <p className="text-gray-600">
              Todos os {count} contatos foram processados com sucesso.
            </p>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            >
              {isDownloading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Gerando arquivo...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Campanha Personalizada
                </>
              )}
            </Button>
          </div>,
          "bot"
        );
      }
    } catch (error) {
      console.error("Error in handleCheckStatus:", error);
      addMessage(
        "Erro ao verificar o status do processamento. Tente novamente.",
        "bot"
      );
    }
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
        const csvInfo = csvFileName && csvRowCount > 0
          ? `${csvFileName} (${csvRowCount} registros)`
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
      addMessage("Clique em 'Consultar Status' para verificar o andamento do processamento.", "bot");
    }
  };

  const getOptionLabel = (field: string, value: string): string => {
    const step = steps.find(s => s.field === field);
    if (!step || !step.options) return value;
    
    const option = step.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      <SurveyHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={handleBack}
      />
      
      <SurveyContent
        messages={messages}
        isWaitingForResponse={isWaitingForResponse}
        showOptions={showOptions}
        showSlider={showSlider}
        sliderValue={sliderValue}
        onOptionSelect={handleOptionSelect}
        onSliderChange={handleSliderChange}
        onSliderComplete={handleSliderComplete}
      />
      
      <FileHandler onFileChange={handleFileChange} />
      
      <SurveyFooter
        currentStep={currentStep}
        totalSteps={steps.length}
        currentInput={currentInput}
        onInputChange={setCurrentInput}
        onSendMessage={handleSendMessage}
        onFileUpload={() => document.querySelector('input[type="file"]')?.click()}
        onSubmit={handleSubmit}
        onCheckStatus={handleCheckStatus}
        isSubmitting={isSubmitting}
        isDownloading={progress.isDownloading}
        showInput={currentStep < 6 && !showOptions && !showSlider}
        processingId={progress.processingId}
      />
    </div>
  );
};

export default ChatbotSurvey;
