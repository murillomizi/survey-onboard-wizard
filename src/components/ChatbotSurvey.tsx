import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Send, Paperclip, CircleDot } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

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

  const [surveyData, setSurveyData] = useState({
    canal: "",
    funnelStage: "",
    csvFile: null as File | null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "",
    tomVoz: "",
    template: "",
    gatilhos: ""
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const steps = [
    {
      question: "Olá! Vamos configurar sua sequência de mensagens. Qual canal você quer usar para sua comunicação?",
      options: [
        { value: "linkedin", label: "LinkedIn" },
        { value: "cold-email", label: "Cold E-mail" }
      ],
      field: "canal"
    },
    {
      question: "Ótimo! Em que estágio do funil de vendas está sua base de contatos?",
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
      question: "Quantos touchpoints você planeja para esta sequência?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" }
      ],
      field: "touchpoints"
    },
    {
      question: "Qual tom de voz você prefere para suas mensagens?",
      options: [
        { value: "amigavel", label: "Amigável" },
        { value: "neutro", label: "Neutro" },
        { value: "formal", label: "Formal" },
        { value: "autoritario", label: "Autoritário" }
      ],
      field: "tomVoz"
    },
    {
      question: "Qual template você gostaria de usar?",
      options: [
        { value: "proposta", label: "Proposta de Valor" },
        { value: "solucao", label: "Solução de Problema" },
        { value: "case", label: "Case de Sucesso" },
        { value: "desconto", label: "Oferta com Desconto" }
      ],
      field: "template"
    },
    {
      question: "Por último, gostaria de aplicar algum gatilho de persuasão?",
      options: [
        { value: "sem-gatilho", label: "Sem gatilho" },
        { value: "escassez", label: "Escassez" },
        { value: "urgencia", label: "Urgência" },
        { value: "social", label: "Prova Social" }
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
      { id: Date.now(), content, type }
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
      addMessage(`Arquivo: ${file.name}`, "user");
      setSurveyData({
        ...surveyData,
        csvFile: file,
        csvFileName: file.name
      });
      
      setIsWaitingForResponse(true);
      setTimeout(() => {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }, 1000);
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
        const summaryContent = (
          <div>
            <p><strong>Canal:</strong> {getOptionLabel("canal", surveyData.canal)}</p>
            <p><strong>Estágio do Funil:</strong> {getOptionLabel("funnelStage", surveyData.funnelStage)}</p>
            <p><strong>Site:</strong> {surveyData.websiteUrl}</p>
            <p><strong>Tamanho:</strong> {surveyData.tamanho} caracteres</p>
            <p><strong>Touchpoints:</strong> {surveyData.touchpoints}</p>
            <p><strong>Tom de voz:</strong> {getOptionLabel("tomVoz", surveyData.tomVoz)}</p>
            <p><strong>Template:</strong> {getOptionLabel("template", surveyData.template)}</p>
            <p><strong>Gatilhos:</strong> {getOptionLabel("gatilhos", surveyData.gatilhos)}</p>
            <p><strong>Arquivo:</strong> {surveyData.csvFileName || "Nenhum arquivo selecionado"}</p>
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

  const handleSubmit = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências de mensagem foram salvas com sucesso.",
    });
    
    console.log("Dados do formulário:", surveyData);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium text-gray-600">
            Passo {currentStep + 1} de {steps.length}
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
        
        {currentStep === 8 && (
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
          {currentStep === 8 && (
            <Button
              type="button"
              onClick={triggerFileUpload}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200"
            >
              <Paperclip size={18} />
              Upload CSV
            </Button>
          )}
          
          {currentStep < 8 && showOptions === null && !showSlider && (
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
