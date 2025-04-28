
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
  const { toast } = useToast();
  
  const surveyForm = useSurveyForm();

  useEffect(() => {
    if (initialSurveyId) {
      setIsLoadingPastChat(true);
      
      const timer = setTimeout(() => {
        setIsLoadingPastChat(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [initialSurveyId]);

  const loadPastSurvey = async (surveyId: string) => {
    if (!surveyId) return null;
    
    try {
      setIsLoadingPastChat(true);
      // Usar loadSurvey do useSurveyForm (que inclui o loadSurvey do useSurveyManager)
      return await surveyForm.loadSurvey(surveyId);
    } finally {
      setTimeout(() => {
        setIsLoadingPastChat(false);
      }, 500);
    }
  };

  const handleFileUpload = async (file: File): Promise<boolean> => {
    return surveyForm.handleFileUpload(file);
  };

  // Verificar status de processamento
  const checkProcessingStatus = async (surveyId: string) => {
    if (!surveyId) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: false
        }
      });
      
      if (error) throw error;
      
      return {
        isComplete: data.isComplete,
        processedCount: data.count,
        totalCount: data.total
      };
    } catch (error) {
      console.error("Error checking processing status:", error);
      return null;
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
    isSubmitting: surveyForm.isSubmitting,
    checkProcessingStatus
  };
};
