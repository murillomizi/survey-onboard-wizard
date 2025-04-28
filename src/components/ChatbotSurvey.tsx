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

interface Message {
  id: number;
  content: React.ReactNode;
  type: "user" | "bot";
}

interface ChatbotSurveyProps {
  initialSurveyId?: string | null;
}

const ChatbotSurvey = ({ initialSurveyId = null }: ChatbotSurveyProps) => {
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
  const [csvRowCount, setCsvRowCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(initialSurveyId);
  const pollingRef = useRef<number | null>(null);
  const [isLoadingPastChat, setIsLoadingPastChat] = useState(false);

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
                className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              >
                Baixar Campanha Personalizada
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
              setCsvRowCount(filteredData.length);
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
      console.log(`Checking progress via Edge Function for survey ID: ${surveyId}`);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId }
      });
      
      if (error) {
        console.error("Error calling checkProgress Edge Function:", error);
        return;
      }

      if (data) {
        const count = data.count || 0;
        setProcessedCount(count);
        
        const csvDataLength = Array.isArray(surveyData.csvData) ? surveyData.csvData.length : 0;
        
        if (count >= csvDataLength && csvDataLength > 0) {
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          
          addMessage(
            <div className="space-y-2">
              <p className="font-medium">🎉 Processamento concluído!</p>
              <p className="text-gray-600">
                Todos os {count} contatos foram processados com sucesso.
              </p>
              <Button
                onClick={handleDownload}
                className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              >
                Baixar Campanha Personalizada
              </Button>
            </div>,
            "bot"
          );
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
      
      toast({
        title: "Preparando download",
        description: "Aguarde enquanto preparamos seus dados para download...",
      });
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { 
          surveyId: processingId,
          fetchData: true
        }
      });
      
      if (error) {
        console.error("Error fetching processed data:", error);
        toast({
          title: "Erro ao baixar",
          description: "Não foi possível baixar os resultados processados.",
          variant: "destructive"
        });
        return;
      }
      
      if (!data || !data.processedData || data.processedData.length === 0) {
        console.error("No data found for download");
        toast({
          title: "Sem dados",
          description: "Não há dados processados disponíveis para download.",
          variant: "destructive"
        });
        return;
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
    if (!processingId) {
      addMessage(
        "Nenhum processamento em andamento. Por favor, inicie um novo processamento.",
        "bot"
      );
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId: processingId }
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
              className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            >
              Baixar Campanha Personalizada
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

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
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
        {isLoadingPastChat ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
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
          </>
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
              onClick={processingId ? handleCheckStatus : handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
            >
              {processingId ? 'Consultar Status' : (isSubmitting ? 'Salvando...' : 'Continuar')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
