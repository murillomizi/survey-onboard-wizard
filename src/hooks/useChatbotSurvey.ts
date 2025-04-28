
import { useState, useEffect } from "react";
import { useSurveyForm } from "@/hooks/useSurveyForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface StepOption {
  value: string;
  label: string;
}

export interface Step {
  question: string;
  options?: StepOption[];
  field: string;
  inputType?: "text" | "slider" | "file" | "summary";
  description?: string;
}

export const steps: Step[] = [
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

export const useChatbotSurvey = (initialSurveyId?: string | null) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: StepOption[];
    step: number;
    isComplete: boolean;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const [isLoadingPastChat, setIsLoadingPastChat] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const surveyForm = useSurveyForm();

  useEffect(() => {
    if (initialSurveyId) {
      loadPastSurvey(initialSurveyId);
    }
  }, [initialSurveyId]);

  const loadPastSurvey = async (surveyId: string) => {
    try {
      setIsLoadingPastChat(true);
      
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
        return;
      }
      
      if (data) {
        const csvDataArray = Array.isArray(data.csv_data) ? data.csv_data : [];
        surveyForm.setSurveyData({
          ...surveyForm.surveyData,
          canal: data.canal || "",
          touchpoints: data.touchpoints || "3",
          funnelStage: data.funnel_stage || "",
          websiteUrl: data.website_url || "",
          tamanho: data.message_length || 350,
          tomVoz: data.tone_of_voice || "",
          gatilhos: data.persuasion_trigger || "",
          csvFileName: data.csv_file_name || "",
          csvFile: null,
          template: surveyForm.surveyData.template
        });
        
        if (csvDataArray.length > 0) {
          surveyForm.setParsedCsvData(csvDataArray);
          surveyForm.setTotalCount(csvDataArray.length);
        }
        
        // Check if processing is complete
        if (data.id) {
          try {
            await surveyForm.checkProgress(data.id);
          } catch (err) {
            console.error("Error checking progress:", err);
          }
        }
      }
      
    } catch (error) {
      console.error("Error loading past survey:", error);
    } finally {
      setIsLoadingPastChat(false);
    }
  };

  // Função para lidar com o upload de arquivo CSV
  const handleFileUpload = async (file: File): Promise<boolean> => {
    if (file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Atualiza o estado com o arquivo selecionado
      surveyForm.setSurveyData(prevData => ({
        ...prevData,
        csvFile: file,
        csvFileName: file.name
      }));
      
      return true;
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Não foi possível processar o arquivo CSV.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    currentInput,
    setCurrentInput,
    isWaitingForResponse,
    setIsWaitingForResponse,
    showOptions,
    setShowOptions,
    showSlider,
    setShowSlider,
    sliderValue,
    setSliderValue,
    isLoadingPastChat,
    loadPastSurvey,
    surveyForm,
    handleFileUpload,
    isSubmitting,
    setIsSubmitting
  };
};
